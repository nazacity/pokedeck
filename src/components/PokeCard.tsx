import React from 'react';
import { Box } from '@mui/system';
import { IPoke } from 'models/poke.model';
import { Grid, Typography } from '@mui/material';
import { COLORS } from 'theme';
import useAsync from 'utils/useAsync';
import pokeServices from 'services/poke.services';

interface IProps {
  item: IPoke;
}

const PokeCard: React.FC<IProps> = ({ item }) => {
  const { data: pokeDetail } = useAsync(pokeServices.getPokemonById, {
    args: item.url,
    immediate: true,
  });

  return (
    <Grid item xs={3}>
      <Box
        sx={{
          bgcolor: COLORS.white,
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            backgroundImage: `url(${pokeDetail?.sprites?.back_default})`,
            width: 72,
            height: 72,
            borderRadius: 25,
            bgcolor: COLORS.background_color.default,
            backgroundSize: 'cover',
            mr: 2,
          }}
        />

        <Typography sx={{ fontSize: 20 }}>{item.name}</Typography>
      </Box>
    </Grid>
  );
};

export default PokeCard;
