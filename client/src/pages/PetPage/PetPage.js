import { useState } from 'react';
import { Heart, Search, User } from 'lucide-react';
import './PetPage.css';
import Navbar from '../../components/Navbar/Navbar.js';
import image1 from '../../assets/1.png'
import image2 from '../../assets/2.png'
import image3 from '../../assets/3.png'

const MOCK_PETS = [
  {
    id: 1,
    name: 'Luna',
    age: '2 years',
    address: 'Brooklyn, NY',
    image: image1,
    breed: 'Golden Retriever',
    gender: 'Female',
    category: 'Dog',
    stayLength: 'Longest stay',
  },
  {
    id: 2,
    name: 'Max',
    age: '1 year',
    address: 'Austin, TX',
    image: image2,
    breed: 'French Bulldog',
    gender: 'Male',
    category: 'Dog',
    stayLength: 'Recently added',
  },
  {
    id: 3,
    name: 'Bella',
    age: '3 years',
    address: 'San Francisco, CA',
    image: image3,
    breed: 'Labrador Retriever',
    gender: 'Female',
    category: 'Dog',
    stayLength: 'Longest stay',
  },
  {
    id: 4,
    name: 'Charlie',
    age: '4 months',
    address: 'Seattle, WA',
    image: image3,
    breed: 'Beagle',
    gender: 'Male',
    category: 'Dog',
    stayLength: 'Recently added',
  },
  {
    id: 5,
    name: 'Daisy',
    age: '5 years',
    address: 'Denver, CO',
    image: image2,
    breed: 'Poodle',
    gender: 'Female',
    category: 'Dog',
    stayLength: 'Senior pet',
  },
  {
    id: 6,
    name: 'Rocky',
    age: '6 months',
    address: 'Chicago, IL',
    image: image1,
    breed: 'Boxer',
    gender: 'Male',
    category: 'Dog',
    stayLength: 'Recently added',
  }
];


export default function PetPage() {
  const [selectedBreed, setSelectedBreed] = useState('Any');
  const [selectedAge, setSelectedAge] = useState('Any');
  const [selectedGender, setSelectedGender] = useState('Any');
  const [activeFilters, setActiveFilters] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (petId) => {
    setFavorites((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const removeFilter = (filter) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  };

  const applyFilters = () => {
    const newFilters = [];
    if (selectedBreed !== 'Any') newFilters.push(selectedBreed);
    if (selectedAge !== 'Any') newFilters.push(selectedAge);
    if (selectedGender !== 'Any') newFilters.push(selectedGender);
    setActiveFilters(newFilters);
  };

  return (<>
    <Navbar />
    <div className="pet-page">
      <main className="main-content">
        {/* Filters Section
        <section className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label>Select Breed</label>
              <select
                value={selectedBreed}
                onChange={(e) => setSelectedBreed(e.target.value)}
              >
                <option>Any</option>
                <option>Golden Retriever</option>
                <option>French Bulldog</option>
                <option>Labrador</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Age</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
              >
                <option>Any</option>
                <option>Puppy</option>
                <option>Young</option>
                <option>Adult</option>
                <option>Senior</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option>Any</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <button className="filter-button" onClick={applyFilters}>
              Filter
            </button>
          </div>
        </section>

        <section className="selected-filters">
          <h2>Selected Filters</h2>
          <div className="filter-tags">
            {activeFilters.map((filter) => (
              <div key={filter} className="filter-tag">
                {filter}
                <button onClick={() => removeFilter(filter)}>&times;</button>
              </div>
            ))}
          </div>
        </section> */}

        {/* Pets Grid */}
        <section className="pets-grid">
          {MOCK_PETS.map((pet) => (
            <div key={pet.id} className="pet-card">
              <div className="pet-image">
                <img src={pet.image} alt={pet.name} />
                <button
                  className={`favorite-button ${favorites.includes(pet.id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(pet.id)}
                >
                  <Heart className="heart-icon" />
                </button>
              </div>
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>{pet.age}</p>
                <p>{pet.address}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-arrow">&lt;</button>
          <div className="pagination-numbers">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`pagination-number ${num === 1 ? 'active' : ''}`}
              >
                {num}
              </button>
            ))}
            <span>...</span>
            <button className="pagination-number">10</button>
          </div>
          <button className="pagination-arrow">&gt;</button>
        </div>
      </main>
    </div>
  </>)
}
