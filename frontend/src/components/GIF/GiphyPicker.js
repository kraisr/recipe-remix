import React, { useState, useContext, useEffect } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import {
  Carousel,
  SearchBar,
  SearchContextManager,
  SearchContext
} from '@giphy/react-components';

// Initialize GiphyFetch with your API key
const giphyFetch = new GiphyFetch('hF8C3cocUNE8niLuyAlMj8eLPWv8f9hU');

const GiphyPicker = ({ onSelect }) => {
  // State for the search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for the GIFs to display in the Carousel
  const [gifs, setGifs] = useState([]);

  // Effect to fetch GIFs when searchTerm changes
  useEffect(() => {
    const fetch = async () => {
      const { data } = searchTerm === ''
        ? await giphyFetch.trending({ limit: 5 })
        : await giphyFetch.search(searchTerm, { limit: 5 });
      setGifs(data);
    };

    fetch();
  }, [searchTerm]); // Dependency array includes searchTerm

  return (
    <SearchContextManager apiKey='hF8C3cocUNE8niLuyAlMj8eLPWv8f9hU'>
      <div style={{ position: 'relative' }}>
        <SearchBar onSearch={setSearchTerm} />
        <Carousel
          key={searchTerm} // Using searchTerm to re-render the Carousel when search changes
          gifs={gifs} // Pass the gifs state to the Carousel
          gifHeight={150}
          onGifClick={(gif, e) => {
            e.preventDefault();
            onSelect(gif);
          }}
        />
      </div>
    </SearchContextManager>
  );
};

export default GiphyPicker;





// import React, { useState, useContext } from 'react';
// import { GiphyFetch } from '@giphy/js-fetch-api';
// import {
//   Grid,
//   SearchBar,
//   SearchContextManager,
//   SearchContext,
//   SuggestionBar,
//   Carousel, // if you want to use suggestions
// } from '@giphy/react-components';

// // Initialize the GiphyFetch with your API key
// const giphyFetch = new GiphyFetch('hF8C3cocUNE8niLuyAlMj8eLPWv8f9hU');

// const GiphyPicker = ({ onSelect }) => {
//   // State to store the search term
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchGifs = (offset) => {
//     return giphyFetch.trending({ offset, limit: 10 }).catch(e => {
//       console.error('Error fetching GIFs:', e);
//     });
//   };
  

//   return (
//     <SearchContextManager apiKey={'hF8C3cocUNE8niLuyAlMj8eLPWv8f9hU'}>
//       <Components onSelect={onSelect} 
//       setSearchTerm={setSearchTerm} 
//       fetchGifs={fetchGifs} />
//     </SearchContextManager>
//   );
// };

// const Components = ({ onSelect, setSearchTerm, fetchGifs }) => {
//   const { searchKey } = useContext(SearchContext);

//   return (
//     <>
//       <SearchBar onSearch={(term) => setSearchTerm(term)} />
//       <SuggestionBar />
//       <Carousel
//         key={searchKey}
//         columns={3}
//         width={300} // or you can use window.innerWidth or any other width you prefer
//         fetchGifs={fetchGifs}
//         onGifClick={(gif, e) => {
//           e.preventDefault(); // Prevent the default action of the click
//           onSelect(gif); // Handle the GIF selection
//         }}
//       />
//     </>
//   );
// };

// export default GiphyPicker;
