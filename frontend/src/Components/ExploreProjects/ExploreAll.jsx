

import { useState } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import "./ExploreAll.css";

const projects = [
  {
    id: 1,
    name: "Express API Generator",
    tech: "Express",
    category: "REST API",
    rating: 4.5,
    price: "₹499",
    desc: "Auto generates Express backend structure with authentication and modular architecture."
  },
  {
    id: 2,
    name: "Spring Boot Auth Service",
    tech: "Spring Boot",
    category: "Authentication",
    rating: 4.2,
    price: "₹699",
    desc: "JWT based authentication microservice with role management and security layers."
  },
  {
    id: 3,
    name: "Laravel Ecommerce Backend",
    tech: "Laravel",
    category: "Ecommerce",
    rating: 4.7,
    price: "₹899",
    desc: "Complete ecommerce backend including payments, cart system and order management."
  },
  {
    id: 4,
    name: "Mongo CRUD API",
    tech: "Node",
    category: "Database",
    rating: 3.9,
    price: "Free",
    desc: "CRUD boilerplate with MongoDB integration and scalable folder structure."
  }
];

export default function ExploreAll() {

  const [search, setSearch] = useState("");
  const [tech, setTech] = useState("");
  const [category, setCategory] = useState("");

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={15}
          className={i <= fullStars ? "star-filled" : "star-icon"}
          fill={i <= fullStars ? "#f5a3c7" : "none"}
        />
      );
    }

    return stars;
  };

  const filteredProjects = projects.filter((p) =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.toLowerCase().includes(search.toLowerCase())) &&
    (tech ? p.tech === tech : true) &&
    (category ? p.category === category : true)
  );

  return (
    <div className="explore-page">

      {/* Search */}
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          className="search-bar"
          placeholder="Search projects or technology..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="explore-layout">

        {/* Filters */}
        <div className="filter-panel">

          <div className="filter-title">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <h4>Technology</h4>
          <select onChange={(e) => setTech(e.target.value)}>
            <option value="">All</option>
            <option value="Express">Express</option>
            <option value="Spring Boot">Spring Boot</option>
            <option value="Laravel">Laravel</option>
            <option value="Node">Node</option>
          </select>

          <h4>Category</h4>
          <select onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            <option value="REST API">REST API</option>
            <option value="Authentication">Authentication</option>
            <option value="Ecommerce">Ecommerce</option>
            <option value="Database">Database</option>
          </select>

        </div>

        {/* Cards */}
        <div className="product-grid">

          {filteredProjects.map((p, index) => (

            <div
              className="product-card"
              style={{ animationDelay: `${index * 0.08}s` }}
              key={p.id}
            >

              <div className="product-img shimmer"></div>

              <div className="product-content">

                <div className="product-title">{p.name}</div>

                <div className="product-desc">{p.desc}</div>

                <div className="tag-row">
                  <span className="tag">{p.tech}</span>
                  <span className="tag">{p.category}</span>
                </div>

                <div className="card-footer">

                  <span className="price-tag">{p.price}</span>

                  <div className="rating-box">
                    <div className="star-row">
                      {renderStars(p.rating)}
                    </div>
                    <span className="rating-number">{p.rating}</span>
                  </div>

                  <button className="view-btn">
                    View Details
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
