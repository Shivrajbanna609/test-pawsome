import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './HomePage.css'
import mainpageimg from '../../assets/mainpageimg.png'
import vecpaw from '../../assets/vec_paw.png'
import vec_med from '../../assets/vec_med.png'
import vec_search from '../../assets/vec_search.png'
import mainpagebottom from '../../assets/mainpagebottom.png'
import Footer from '../../components/Footer/Footer'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div>
        <div className="container">
          <div className="left">
            <h1>ADOPT A 🐶<br /> <span>FOREVER</span> <br /> <span>FRIEND</span> TODAY</h1>
          </div>
          <div className="right">
            <img src={mainpageimg} alt="" />
          </div>
        </div>

        <div className="pageMiddle">
          <div className="heading">
            <h1>Our Services</h1>
            <p>Service loved by people and pets</p>
          </div>
          <div className="boxes">
            <div className="box">
              <img src={vecpaw} alt="" />
              <p>Adopt a Pet</p>
            </div>
            <div className="box">
              <img src={vec_med} alt="" />
              <p>Doctor Support</p>
            </div>
            <div className="box">
              <img src={vec_search} alt="" />
              <p>Search Partner</p>
            </div>
          </div>
        </div>

        <section className="about-section">
          <div className="about-container">
            <div className="title">
              <h2>ABOUT US</h2>
            </div>
            <div className="content">
              <div className="image-container">
                <img src={mainpagebottom} alt="Illustration of a person with their dog" />
              </div>
              <div className="text-container">
                <p>
                  Welcome to <span className="highlight">Pawsome Community</span>! We're all about pets and the
                  people who love them. Whether you're looking for a new pet,
                  need a nearby vet, or want to find a mate for breeding, we're
                  here to help. Our goal is to create a friendly place where pet
                  owners can connect, share advice, and make furry friends. Join
                  us in celebrating the special bond between humans and their animal
                  companions. Let's make the world a happier place for pets, one paw at a time
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}

export default HomePage
