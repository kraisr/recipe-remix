import React from 'react';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const gf = new GiphyFetch(process.env.GIPHY_TOKEN)

const fetchGifs = (offset) => gf.trending({ offset, limit: 10 });

const GiphyPicker = ({ onSelect }) => {
    return (
        <Grid width={300} columns={2} fetchGifs={fetchGifs} onGifClick={(gif, e) => {
            e.preventDefault();
            onSelect(gif);
        }} />
    );
};

export default GiphyPicker;
