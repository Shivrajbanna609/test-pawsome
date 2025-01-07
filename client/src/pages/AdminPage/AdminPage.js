import React, { useState, useEffect, useContext } from 'react';
import './AdminPage.css';
import { AppContext } from '../../Context/AppContect.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function AdminPage() {
    const [pets, setPets] = useState([]);
    const [pet, setPet] = useState({
        name: '',
        age: '',
        breed: '',
        image: null,
        description: '',
        adopted: false
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { backendurl } = useContext(AppContext);
    

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
          const { data } = await axios.get(backendurl + '/api/pets/getallpet', {
            withCredentials: true,
          });
          if (data.success) {
            setPets(data.pets);
          } else {
            toast.error(data.message || 'Failed to fetch pets');
          }
        } catch (err) {
          console.error('Error fetching pets:', err);
          toast.error(err.response?.data?.message || 'Error fetching pets');
        }
    };
      
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setPet((prev) => ({ ...prev, [name]: files[0] }));
        } else if (type === 'checkbox') {
            setPet((prev) => ({ ...prev, [name]: e.target.checked }));
        } else {
            setPet((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const url = editingId ? `/api/pets/${editingId}` : '/api/pets/addpet';
            const method = editingId ? 'PUT' : 'POST';
    
            const formData = new FormData();
            Object.keys(pet).forEach(key => {
                if (key === 'image' && pet[key] instanceof File) {
                    formData.append('image', pet[key]);
                } else {
                    formData.append(key, pet[key]);
                }
            });
    
            const response = await axios({
                method,
                url: backendurl + url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
    
            if (response.data.success) {
                setSuccess(editingId ? 'Pet updated successfully' : 'Pet added successfully');
                fetchPets();
                setPet({ name: '', age: '', breed: '', image: null, description: '', adopted: false });
                setEditingId(null);
            } else {
                setError('Failed to save pet');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Error saving pet');
        }
    };

    const handleEdit = (pet) => {
        setEditingId(pet._id);
        setPet({ ...pet, image: null }); // Reset image to null when editing
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${backendurl}/api/pets/${id}`,
                withCredentials: true,
            });
    
            if (response.data.success) {
                setSuccess('Pet deleted successfully');
                fetchPets();
            } else {
                setError('Failed to delete pet');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.response?.data?.message || 'Error deleting pet');
        }
    };
    
    return (
        <div className="admin-page">
            <h1>Admin Panel</h1>

            <form onSubmit={handleSubmit} className="pet-form">
                <h2>{editingId ? 'Edit Pet' : 'Add New Pet'}</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                <input type="text" name="name" placeholder="Name" value={pet.name} onChange={handleChange} required />
                <input type="number" name="age" placeholder="Age" value={pet.age} onChange={handleChange} required />
                <input type="text" name="breed" placeholder="Breed" value={pet.breed} onChange={handleChange} required />
                <input type="file" name="image" onChange={handleChange} accept="image/*" />
                <textarea name="description" placeholder="Description" value={pet.description} onChange={handleChange}></textarea>
                <label>
                    Adopted:
                    <input type="checkbox" name="adopted" checked={pet.adopted} onChange={handleChange} />
                </label>

                <button type="submit">{editingId ? 'Update Pet' : 'Add Pet'}</button>
            </form>

            <h2>Pet List</h2>
            <table className="pet-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Breed</th>
                        <th>Image</th>
                        <th>Adopted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map((pet) => (
                        <tr key={pet._id}>
                            <td>{pet.name}</td>
                            <td>{pet.age}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.image ? <img src={pet.image} alt={pet.name} style={{width: '50px', height: '50px'}} /> : 'No image'}</td>
                            <td>{pet.adopted ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => handleEdit(pet)}>Edit</button>
                                <button onClick={() => handleDelete(pet._id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

