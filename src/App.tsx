import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import PokeCard from 'components/PokeCard';
import { IPoke } from 'models/poke.model';
import React, { useEffect, useState } from 'react';
import pokeServices from 'services/poke.services';
import { COLORS } from 'theme';
import useAsync from 'utils/useAsync';
import _ from 'lodash';
import poke_config from 'constants/poke_config';

const App = () => {
  const [page, setPage] = useState<number>(1);
  const [sort, setSort] = useState<string>('name');
  const [total, setTotal] = useState<number>(0);
  const [pokeLists, setPokeLists] = useState<IPoke[]>([]);
  const { execute: getPokemons, status: pokeListsLoading } = useAsync(
    pokeServices.getPokemons,
    {
      immediate: true,
      args: {
        offset: 0,
      },
      onSuccess: (data) => {
        setTotal(data.count);

        _HandleSort(data.results);
      },
    }
  );

  const _HandleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSort((event.target as HTMLInputElement).value);
  };

  const _HandleSort = (pokeData: IPoke[]) => {
    const data = _.sortBy(pokeData, sort);
    setPokeLists(data);
  };

  useEffect(() => {
    _HandleSort(pokeLists);
  }, [sort]);

  const _HandleNextPage = () => {
    setPage(page + 1);
    getPokemons({ offset: (page + 1) * poke_config.itemPerPage });
  };

  const _HandlePreviosPage = () => {
    if (page >= 2) {
      setPage(page - 1);
      getPokemons({ offset: (page - 1) * poke_config.itemPerPage });
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: COLORS.background_color.default,
        display: 'flex',
        justifyContent: 'center',
        height: '100vw',
      }}
    >
      <Box sx={{ maxWidth: 1440, width: '100vw' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h3" sx={{ fontSize: 32 }}>
            All the Pokemon!
          </Typography>
          <Box>
            <FormControl>
              <RadioGroup
                defaultValue="name"
                name="sort"
                value={sort}
                onChange={_HandleSortChange}
              >
                <Box sx={{ display: 'flex' }}>
                  <FormControlLabel
                    value="name"
                    control={<Radio />}
                    label="Sort Name"
                  />
                  <FormControlLabel
                    value="url"
                    control={<Radio />}
                    label="Sort ID"
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>

        {pokeListsLoading === 'loading' && (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <Grid key={item} item xs={3}>
                <Skeleton
                  variant="rectangular"
                  sx={{ height: 80, borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {pokeListsLoading === 'successed' && pokeLists && pokeLists.length > 0 && (
          <Grid container spacing={2}>
            {pokeLists.map((item: IPoke) => {
              return <PokeCard key={item.name} item={item} />;
            })}
          </Grid>
        )}
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          p: 4,
        }}
      >
        <Button
          variant="outlined"
          disabled={page === 1 ? true : false}
          onClick={_HandlePreviosPage}
        >
          Previos 12
        </Button>
        <Button
          variant="outlined"
          onClick={_HandleNextPage}
          disabled={(page + 1) * poke_config.itemPerPage > total ? true : false}
        >
          Next 12
        </Button>
      </Box>
    </Box>
  );
};

export default App;
