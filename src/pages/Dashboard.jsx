const fullColorMap = {
  // Colors from the image
  green: '#49D0B0',  // Bulbasaur's card
  red: '#FB6C6C',    // Charmander's card
  blue: '#76BDFE',   // Squirtle's card
  yellow: '#FFD76F', // Pikachu's card

  // Refreshed secondary colors
  purple: '#AC92EC',
  pink: '#F778A1',
  brown: '#B1736C',
  gray: '#AAB7B8',
  black: '#5D6D7E',
  white: '#AAB7B8',
};
import pokeballImage from '../assets/pokeball.png'; 
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ onLogout }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const navigate = useNavigate();
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchPokemons = async (currentOffset = 0, append = false) => {
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=21&offset=${currentOffset}`);
      const data = await res.json();

      // Check if there are more Pokemon to load
      setHasMore(data.next !== null);

      const detailedData = await Promise.all(
        data.results.map(async (poke) => {
          const res = await fetch(poke.url);
          const fullData = await res.json();

          const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${fullData.id}`);
          const speciesData = await speciesRes.json();

          return {
            ...fullData,
            color: speciesData.color.name,
          };
        })
      );


if (append) {
  setPokemonList(prev => [...prev, ...detailedData]);
  setFilteredPokemonList(prev => [...prev, ...detailedData]); // <- ADDED
} else {
  setPokemonList(detailedData);
  setFilteredPokemonList(detailedData); // <- ADDED
}
    } catch (err) {
      console.error('Error fetching:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const loadMore = () => {
    const newOffset = offset + 21;
    setOffset(newOffset);
    fetchPokemons(newOffset, true);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredPokemonList(pokemonList);
      return;
    }
  
    setIsSearching(true);
    try {
      // Get all Pokemon from API (first 1000)
      const allPokemonResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const allPokemonData = await allPokemonResponse.json();
      
      // Dictionary-style filtering
      const matchingPokemon = allPokemonData.results
        .filter(pokemon => pokemon.name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 10); // Show first 10 results
  
      if (matchingPokemon.length === 0) {
        // If no results starting with the query, fall back to contains search
        const containsMatches = allPokemonData.results
          .filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
        
        if (containsMatches.length > 0) {
          const detailedContains = await Promise.all(
            containsMatches.map(async (pokemon) => {
              const pokemonResponse = await fetch(pokemon.url);
              const pokemonData = await pokemonResponse.json();
              
              const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
              const speciesData = await speciesResponse.json();
              
              return {
                ...pokemonData,
                color: speciesData.color.name,
              };
            })
          );
          setFilteredPokemonList(detailedContains);
        } else {
          setFilteredPokemonList([]);
        }
      } else {
        // Fetch detailed data for Pokemon starting with the query
        const detailedMatches = await Promise.all(
          matchingPokemon.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            
            const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
            const speciesData = await speciesResponse.json();
            
            return {
              ...pokemonData,
              color: speciesData.color.name,
            };
          })
        );
  
        setFilteredPokemonList(detailedMatches);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search Pokemon. Please try again.');
      setFilteredPokemonList([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredPokemonList(pokemonList);
  };

  const logout = () => {
    localStorage.removeItem('loggedIn');
    onLogout();
    navigate('/');
  };

  return (
    <div style={{ 
      padding: 20,
      backgroundColor: '#F5F5F5',  
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      boxSizing: 'border-box',
      overflowX: 'hidden',
    }}>

      <img src={pokeballImage} alt="pokemon" style={{ width: '400px', height: '120px', display: 'block', margin: 'auto' }} />

            {/* Search Bar */}
            <div style={{
        maxWidth: '600px',
        margin: '20px auto',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: '25px',
          padding: '12px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '10px'
        }}>
          <span style={{ marginRight: '10px', color: '#999', fontSize: '20px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search any Pokemon by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              color: '#000',  // <- Change to pure black
              backgroundColor: 'white'  // <- Add this line
            }}
          />

          
          {isSearching && (
            <div style={{ marginLeft: '10px', color: '#FFD76F' }}>Searching...</div>
          )}
          {searchQuery.length > 0 && !isSearching && (
            <button 
              onClick={clearSearch}
              style={{
                marginLeft: '10px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '15px',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#666',
                display: 'flex',           // <- ADD this
                alignItems: 'center',      // <- ADD this
                justifyContent: 'center',   // <- ADD this
              }}
            >
              ×
            </button>
          )}
        </div>

        {isSearching && (
          <div style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            Searching...
          </div>
        )}
      </div>
     
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        columnGap: '60px',
        rowGap: '20px', 
        maxWidth: '600px', 
        width: '100%',
        margin: '20px auto',
        padding: '0 20px',
        boxSizing: 'border-box',
        justifyItems: 'center',
      }}>

        {filteredPokemonList.map((poke) => {
          const id = poke.id;
          // Use high-quality official artwork instead of low-res sprite
          const imageUrl = poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default;
          const primaryType = poke.types[0].type.name;
          const bgColor = fullColorMap[poke.color] || '#ffffff';

          return (
            <div key={id} 
              onClick={() => setSelectedPokemon(poke)}
              style={{
              padding: 16,
              borderRadius: 16,
              backgroundColor: bgColor,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              minHeight: '200px',
              width: '100%',
              position: 'relative', // Enable absolute positioning for children
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              
              {/* Pokemon Name - Top Left */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                zIndex: 2
              }}>
                <h3 style={{
                  fontWeight: 'bold',
                  fontSize: '18px',
                  color: '#ffffff',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
                </h3>
                <p style={{ 
                  fontSize: '12px', 
                  margin: '4px 0 0 0', 
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}>
                  {primaryType.toUpperCase()}
                </p>
                <p style={{ 
                  fontSize: '11px', 
                  margin: '2px 0 0 0', 
                  color: 'rgba(255,255,255,0.7)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontStyle: 'italic'
                }}>
                  {poke.abilities && poke.abilities.length > 0 
                    ? poke.abilities[0].ability.name.charAt(0).toUpperCase() + poke.abilities[0].ability.name.slice(1).replace('-', ' ')
                    : 'Unknown'}
                </p>
              </div>

              {/* Pokemon Image - Bottom Right */}
              <div style={{
                position: 'absolute',
                bottom: '25px',
                right: '8px',
                zIndex: 1
              }}>
                <img src={imageUrl} alt={poke.name} style={{
                  width: 120,
                  height: 120,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} />
              </div>

              {/* Details Link - Bottom Left */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '10px',
                zIndex: 2
              }}>
                <span style={{
                  fontSize: '9px',
                  textDecoration: 'none',
                  color: 'rgba(255,255,255,0.9)',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  padding: '4px 4px',
                  borderRadius: '4px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  Click for details
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setSelectedPokemon(null)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '0',
            width: '350px',
            maxWidth: '90vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPokemon(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0,0,0,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
            ×
            </button>

            {/* Top Section with Pokemon Image */}
            <div style={{
              backgroundColor: fullColorMap[selectedPokemon.color] || '#ffffff',
              padding: '30px 20px 20px',
              textAlign: 'center',
              position: 'relative',
              borderRadius: '20px 20px 200px 200px'
            }}>
              {/* HP Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                backgroundColor: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#333'
              }}>
                HP {selectedPokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0}
              </div>

              {/* Pokemon Image */}
              <img 
                src={selectedPokemon.sprites.other['official-artwork'].front_default || selectedPokemon.sprites.front_default}
                alt={selectedPokemon.name}
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'contain',
                  marginBottom: '20px'
                }}
              />
            </div>

            {/* Pokemon Info Section */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              {/* Pokemon Name */}
              <h2 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 15px 0',
                color: '#333'
              }}>
                {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
              </h2>

              {/* Type Badge */}
              <div style={{
                display: 'inline-block',
                backgroundColor: fullColorMap[selectedPokemon.color] || '#ffffff',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '30px'
              }}>
                {selectedPokemon.types[0].type.name}
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginTop: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {selectedPokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginTop: '5px'
                  }}>
                    Attack
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {selectedPokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginTop: '5px'
                  }}>
                    Defense
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    {selectedPokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginTop: '5px'
                  }}>
                    Speed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && searchQuery.length === 0 &&(
        <div style={{
          textAlign: 'center',
          margin: '30px 0',
        }}>
          <button 
            onClick={loadMore}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            {loading ? 'Loading...' : 'Load More Pokémon'}
          </button>
        </div>
      )}

      {/* Pokemon Count Display */}
      <div style={{
        textAlign: 'center',
        margin: '20px 0',
        color: '#666',
        fontSize: '14px'
      }}>
          {searchQuery.length > 0 
    ? `Found ${filteredPokemonList.length} Pokemon`
    : `Showing ${filteredPokemonList.length} Pokémon`
  }
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <button onClick={logout}
            style={{
              cursor: 'pointer',
              padding: '12px 24px',
              backgroundColor: '#000000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
            Logout
          </button>
      </div>
    </div>
    
  );
}

export default Dashboard;