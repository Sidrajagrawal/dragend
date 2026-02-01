import os
import json
import time
import logging
from typing import List, Dict, Any

# Libraries for the AI and UI
from openai import OpenAI
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv

# Rich for beautiful output
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.progress import Progress, SpinnerColumn, TextColumn
from rich.logging import RichHandler

# ==============================================================================
# 1. SETUP & CONFIGURATION
# ==============================================================================

# Setup beautiful console
console = Console()
logging.basicConfig(
    level="ERROR", 
    format="%(message)s", 
    handlers=[RichHandler(console=console, markup=True)]
)
logger = logging.getLogger("finance_agent")

# Load environment variables (Create a .env file with DB details)
load_dotenv()

class Config:
    """
    Configuration for Local Gemma + MySQL
    """
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASS = os.getenv("DB_PASSWORD", "")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_NAME = os.getenv("DB_NAME", "finance")
    
    # OLLAMA CONFIGURATION (Localhost)
    OLLAMA_BASE_URL = "http://localhost:11434/v1"
    OLLAMA_API_KEY = "ollama"  # Not used, but required by SDK
    MODEL_NAME = "gemma2:2b"      # The model you pulled via 'ollama pull gemma2'

    @classmethod
    def get_db_url(cls):
        return f"mysql+mysqlconnector://{cls.DB_USER}:{cls.DB_PASS}@{cls.DB_HOST}/{cls.DB_NAME}"

# ==============================================================================
# 2. DATABASE ENGINE (The Hands)
# ==============================================================================

class DatabaseEngine:
    def __init__(self):
        try:
            self.engine = create_engine(Config.get_db_url(), pool_recycle=3600)
            self.schema_context = self._scan_database()
            console.print(f"[green]✓ Database connected: {Config.DB_NAME}[/green]")
        except Exception as e:
            console.print(f"[bold red]❌ DB Connection Failed: {e}[/bold red]")
            exit(1)

    def _scan_database(self) -> str:
        """Reflects database schema to teach Gemma what tables exist."""
        try:
            inspector = inspect(self.engine)
            schema_info = []
            
            for table in inspector.get_table_names():
                columns = inspector.get_columns(table)
                col_str = ", ".join([f"{c['name']} ({c['type']})" for c in columns])
                schema_info.append(f"Table: {table}\nColumns: {col_str}")
            
            return "\n\n".join(schema_info)
        except Exception:
            return "Error reading schema."

    def execute_safe_query(self, sql: str) -> str:
        """Executes SQL safely."""
        clean_sql = sql.replace("`", "").replace("sql", "").strip()
        
        # Hard Security Block
        if not clean_sql.lower().startswith("select"):
            return "Error: Security Alert. Only SELECT queries are allowed."

        try:
            with self.engine.connect() as conn:
                result = conn.execute(text(clean_sql))
                keys = result.keys()
                rows = [dict(zip(keys, row)) for row in result.fetchall()]
                
                if not rows:
                    return "No results found."
                return json.dumps(rows[:50], default=str)
        except Exception as e:
            return f"SQL Error: {str(e)}"

# ==============================================================================
# 3. LOCAL GEMMA AGENT (The Brain)
# ==============================================================================

class LocalFinanceAgent:
    def __init__(self, db_engine: DatabaseEngine):
        self.db = db_engine
        
        # Connect to Local Ollama using OpenAI SDK
        self.client = OpenAI(
            base_url=Config.OLLAMA_BASE_URL,
            api_key=Config.OLLAMA_API_KEY
        )
        self.history = []

    def _get_system_prompt(self):
        """
        Gemma-optimized prompt. Gemma 2 prefers clear, direct instructions.
        """
        return f"""
        You are an expert Financial Assistant running locally.
        
        YOUR GOAL: Answer user questions using the database.

        DATABASE SCHEMA:
        {self.db.schema_context}

        INSTRUCTIONS:
        1. When you need data, output the SQL query inside a specific tag like this:
           <TOOL>SELECT * FROM transactions WHERE...</TOOL>
        2. Do not write markdown or explanations when calling the tool. Just the tag.
        3. Once you receive the DATA, explain it to the user in professional Markdown.
        """

    def chat(self, user_input: str):
        # Add user message
        self.history.append({"role": "user", "content": user_input})
        
        try:
            # 1. Visual Spinner
            with Progress(
                SpinnerColumn(),
                TextColumn("[bold magenta]Gemma is thinking..."),
                transient=True
            ) as progress:
                progress.add_task("thinking", total=None)

                # 2. Get Response from Gemma
                response = self.client.chat.completions.create(
                    model=Config.MODEL_NAME,
                    messages=[{"role": "system", "content": self._get_system_prompt()}] + self.history,
                    temperature=0.0
                )
                
                ai_msg = response.choices[0].message.content

            # 3. Check for Tool Call (<TOOL>SQL</TOOL>)
            if "<TOOL>" in ai_msg:
                # Extract SQL
                start = ai_msg.find("<TOOL>") + 6
                end = ai_msg.find("</TOOL>")
                sql_query = ai_msg[start:end].strip()
                
                console.print(f"[dim cyan]⚙️ Running Local SQL: {sql_query}[/dim cyan]")
                
                # Execute Tool
                data_result = self.db.execute_safe_query(sql_query)
                
                # Feed data back to Gemma
                tool_feedback = f"DATABASE_RESULT: {data_result}\n\nNow answer the user's question based on this data."
                self.history.append({"role": "assistant", "content": ai_msg})
                self.history.append({"role": "user", "content": tool_feedback})
                
                # Get Final Answer
                with Progress(SpinnerColumn(), TextColumn("[bold green]Synthesizing Answer..."), transient=True) as p:
                    p.add_task("writing", total=None)
                    final_res = self.client.chat.completions.create(
                        model=Config.MODEL_NAME,
                        messages=[{"role": "system", "content": self._get_system_prompt()}] + self.history,
                        temperature=0.0
                    )
                    final_text = final_res.choices[0].message.content
                    self.history.append({"role": "assistant", "content": final_text})
                    return final_text
            
            else:
                # No tool needed (conversational)
                self.history.append({"role": "assistant", "content": ai_msg})
                return ai_msg

        except Exception as e:
            # Handle connection errors (e.g., Ollama not running)
            if "Connection refused" in str(e):
                return "❌ Error: Is Ollama running? Open a terminal and type `ollama serve`."
            return f"❌ Agent Error: {e}"

# ==============================================================================
# 4. RUNTIME
# ==============================================================================

def main():
    console.clear()
    console.print(Panel.fit(
        "[bold cyan]💰 LOCAL GEMMA FINANCE AGENT[/bold cyan]\n"
        "[dim]Powered by Ollama (Gemma 2) - No APIs, No Limits[/dim]",
        border_style="cyan"
    ))

    try:
        db = DatabaseEngine()
        agent = LocalFinanceAgent(db)
    except Exception:
        return

    while True:
        user_in = console.input("\n[bold green]You > [/bold green]").strip()
        if not user_in or user_in.lower() in ["exit", "quit"]:
            console.print("[yellow]Goodbye![/yellow]")
            break
            
        response = agent.chat(user_in)
        console.print("\n")
        console.print(Markdown(response))

if __name__ == "__main__":
    main()