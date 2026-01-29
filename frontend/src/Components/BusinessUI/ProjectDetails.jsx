import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, Heart } from "lucide-react";
import "./ProjectDetails.css";

const projectData = {
  1: {
    name: "Express Backend Starter",
    description:
      "A production-ready Express.js backend with authentication, clean architecture, and scalable API patterns.",
    tech: "Express.js",
    category: "Backend Infrastructure",
    rating: 4.7,
    reviews: 142,
    price: 499,
    author: "Dragend Team",
    apis: [
      "POST /auth/login",
      "POST /auth/register",
      "GET /users"
    ]
  },

  2: {
    name: "Spring Boot Auth Service",
    description:
      "Secure JWT-based authentication service built with Spring Boot, role-based access control, and enterprise-ready security layers.",
    tech: "Spring Boot",
    category: "Authentication",
    rating: 4.6,
    reviews: 98,
    price: 699,
    author: "Dragend Team",
    apis: [
      "POST /auth/login",
      "POST /auth/signup",
      "GET /auth/roles",
      "POST /auth/refresh"
    ]
  },

  3: {
    name: "Laravel Ecommerce Backend",
    description:
      "Complete ecommerce backend with product management, carts, payments, and order workflows — optimized for scalability.",
    tech: "Laravel",
    category: "Ecommerce",
    rating: 4.8,
    reviews: 176,
    price: 899,
    author: "Dragend Team",
    apis: [
      "GET /products",
      "POST /cart/add",
      "POST /orders/create",
      "POST /payments/checkout"
    ]
  },

  4: {
    name: "MongoDB CRUD API",
    description:
      "Minimal, fast CRUD API with MongoDB integration, validation layers, and clean folder structure.",
    tech: "Node.js",
    category: "Database",
    rating: 4.3,
    reviews: 64,
    price: 0,
    author: "Dragend Team",
    apis: [
      "POST /create",
      "GET /list",
      "PUT /update/:id",
      "DELETE /delete/:id"
    ]
  },

  5: {
    name: "Payments & Subscriptions Service",
    description:
      "Ready-to-integrate payments and subscription backend with Stripe/Razorpay support and webhook handling.",
    tech: "Node.js",
    category: "Payments",
    rating: 4.9,
    reviews: 211,
    price: 999,
    author: "Dragend Team",
    apis: [
      "POST /checkout",
      "POST /subscriptions/create",
      "POST /webhooks/stripe",
      "GET /billing/history"
    ]
  }
};


export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projectData[id];

  if (!project) return null;
  const fullStars = Math.floor(project.rating);

  return (
    <div className="pd-page">

      <button className="pd-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={15} /> Back
      </button>

      <div className="pd-container">

        {/* LEFT */}
        <div className="pd-info">
          <h1>{project.name}</h1>

          <p className="pd-desc">{project.description}</p>

          <div className="pd-tags">
            <span>{project.tech}</span>
            <span>{project.category}</span>
          </div>

          <h4>API Endpoints</h4>
          <ul className="pd-api">
            {project.apis.map((api, i) => (
              <li key={i}>{api}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="pd-purchase_toggle">

          <div className="pd-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                fill={i < fullStars ? "#7c83ff" : "none"}
              />
            ))}
            <span>{project.rating}</span>
            <small>({project.reviews})</small>
          </div>

          <div className="pd-price">₹{project.price}</div>

          <button
            className="pd-buy"
            onClick={() => alert("Checkout coming soon")}
          >
            Get Access
          </button>

          <button
            className="pd-secondary"
            onClick={() => alert("Subscribed")}
          >
            Notify me
          </button>

          <button
            className="pd-wishlist"
            onClick={() => alert("Saved")}
          >
            <Heart size={14} /> Save
          </button>

          <p className="pd-author">
            Built by <strong>{project.author}</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
