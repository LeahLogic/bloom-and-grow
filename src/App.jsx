
import { useState, useEffect } from 'react';
import { plants, catalogPlants } from './data';
import './App.css';

function App() {
  const [currentPlant, setCurrentPlant] = useState(0);

  const [myPlants, setMyPlants] = useState(() => {
    const savedPlants = localStorage.getItem('myPlants');

    return savedPlants ? JSON.parse(savedPlants) : [];
  });

  const [activeTab, setActiveTab] = useState('explore');
  const [showAllPlants, setShowAllPlants] = useState(false);

  const [wateringDates, setWateringDates] = useState(() => {
    const savedDates = localStorage.getItem('wateringDates');

    return savedDates ? JSON.parse(savedDates) : {};
  });

  useEffect(() => {
    localStorage.setItem('myPlants', JSON.stringify(myPlants));
  }, [myPlants]);

  useEffect(() => {
    localStorage.setItem(
      'wateringDates',
      JSON.stringify(wateringDates)
    );
  }, [wateringDates]);

  const previousPlant = () => {
    setCurrentPlant((prev) => {
      return (prev - 1 + plants.length) % plants.length;
    });
  };

  const nextPlant = () => {
    setCurrentPlant((prev) => {
      return (prev + 1) % plants.length;
    });
  };

  const addPlant = (plant) => {
    setMyPlants((prev) => {
      const alreadyAdded = prev.some(
        (item) => item.id === plant.id
      );

      if (alreadyAdded) {
        return prev;
      }

      return [...prev, plant];
    });
  };

  const removePlant = (id) => {
    setMyPlants((prev) => {
      return prev.filter((plant) => plant.id !== id);
    });

    setWateringDates((prev) => {
      const updatedDates = { ...prev };

      delete updatedDates[id];

      return updatedDates;
    });
  };

  const clearAllPlants = () => {
    setMyPlants([]);
    setWateringDates({});
  };

  const markAsWatered = (id) => {
    const today = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    setWateringDates((prev) => ({
      ...prev,
      [id]: today
    }));
  };

  const displayedPlants =
    activeTab === 'explore'
      ? showAllPlants
        ? catalogPlants
        : catalogPlants.slice(0, 8)
      : myPlants;

  return (
    <div className="app">
      <header className="header">
        <a href="#" className="logo">
          Bloom <span>&</span> Grow
        </a>

        <nav className="navigation">
          <a href="#spotlight">
            Plant Spotlight
          </a>

          <a href="#collection">
            My Collection
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR LITTLE INDOOR JUNGLE
            </p>

            <h1>
              A little green,
              <br />
              a lot of <em>joy.</em>
            </h1>

            <p className="hero-description">
              Every plant has a story. Keep your leafy friends
              happy, healthy, and thriving in one beautiful place.
            </p>

            <a
              href="#collection"
              className="hero-button"
            >
              Explore My Plants
            </a>
          </div>

          <div className="hero-image">
            <img
              src="/hero-plant.png"
              alt="ZZ plant surrounded by greenery in a sunlit greenhouse"
            />
          </div>
        </section>

        <section
          className="spotlight"
          id="spotlight"
        >
          <div className="spotlight-heading">
            <p className="eyebrow">
              GET TO KNOW YOUR GREENERY
            </p>

            <h2>
              Plant <em>Spotlight</em>
            </h2>

            <p>
              Discover the beauty and personality of each plant.
            </p>
          </div>

          <div className="spotlight-content">
            <div className="spotlight-image">
              <img
                src={plants[currentPlant].image}
                alt={plants[currentPlant].name}
              />
            </div>

            <div className="spotlight-details">
              <p className="eyebrow">
                MEET YOUR PLANT
              </p>

              <h3>
                {plants[currentPlant].name}
              </h3>

              <p className="scientific-name">
                {plants[currentPlant].scientificName}
              </p>

              <p>
                {plants[currentPlant].description}
              </p>

              <p>
                ☀️ Light: {plants[currentPlant].light}
              </p>

              <p>
                💧 Water: {plants[currentPlant].water}
              </p>

              <div className="slider-buttons">
                <button
                  onClick={previousPlant}
                  aria-label="Previous plant"
                >
                  ← Previous
                </button>

                <span>
                  {currentPlant + 1} / {plants.length}
                </span>

                <button
                  onClick={nextPlant}
                  aria-label="Next plant"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="collection"
          id="collection"
        >
          <div className="collection-heading">
            <p className="eyebrow">
              MY LITTLE GREEN CORNER
            </p>

            <h2>
              My Plant <em>Collection</em>
            </h2>

            <p>
              Explore beautiful houseplants and grow your own collection.
            </p>
          </div>

          <div className="collection-tabs">
            <button
              className={
                activeTab === 'explore'
                  ? 'tab-button active'
                  : 'tab-button'
              }
              onClick={() => setActiveTab('explore')}
            >
              Explore Plants
            </button>

            <button
              className={
                activeTab === 'my-plants'
                  ? 'tab-button active'
                  : 'tab-button'
              }
              onClick={() => setActiveTab('my-plants')}
            >
              My Plants ({myPlants.length})
            </button>
          </div>

          <div className="collection-toolbar">
            <p>
              {activeTab === 'explore'
                ? 'Available Plants:'
                : 'My Plants:'}
              {' '}
              <span>
                {activeTab === 'explore'
                  ? catalogPlants.length
                  : myPlants.length}
              </span>
            </p>

            {activeTab === 'my-plants' &&
              myPlants.length > 0 && (
                <button
                  className="clear-button"
                  onClick={clearAllPlants}
                >
                  Clear All
                </button>
              )}
          </div>

          {displayedPlants.length > 0 ? (
            <div className="collection-grid">
              {displayedPlants.map((plant) => {
                const isAdded = myPlants.some(
                  (item) => item.id === plant.id
                );

                return (
                  <div
                    className="plant-card"
                    key={plant.id}
                  >
                    {plant.image ? (
                      <img
                        src={plant.image}
                        alt={plant.name}
                      />
                    ) : (
                      <div className="plant-placeholder">
                        🌿
                      </div>
                    )}

                    <div className="plant-card-content">
                      <h3>
                        {plant.name}
                      </h3>

                      <p className="scientific-name">
                        {plant.scientificName}
                      </p>

                      <p>
                        ☀️ {plant.light}
                      </p>

                      <p>
                        💧 {plant.water}
                      </p>

                      {activeTab === 'explore' ? (
                        <button
                          className="add-button"
                          onClick={() => addPlant(plant)}
                          disabled={isAdded}
                        >
                          {isAdded
                            ? '✓ Added'
                            : '+ Add Plant'}
                        </button>
                      ) : (
                        <div className="plant-care">
                          <div className="watering-info">
                            <p>
                              💧 Watering Tracker
                            </p>

                            <span>
                              Last watered:{' '}
                              {wateringDates[plant.id] || 'Not yet'}
                            </span>
                          </div>

                          <button
                            className="water-button"
                            onClick={() => markAsWatered(plant.id)}
                          >
                            💧 Mark as Watered
                          </button>

                          <button
                            className="remove-button"
                            onClick={() => removePlant(plant.id)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-collection">
              <h3>
                Your garden is empty 🌱
              </h3>

              <p>
                Explore our plant catalog and add your first leafy friend.
              </p>

              <button
                className="add-button"
                onClick={() => setActiveTab('explore')}
              >
                Explore Plants
              </button>
            </div>
          )}

          {activeTab === 'explore' && (
            <div className="view-all-container">
              <button
                className="view-all-button"
                onClick={() => {
                  setShowAllPlants((prev) => !prev);
                }}
              >
                {showAllPlants
                  ? 'Show Less ↑'
                  : 'View All Plants ↓'}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
