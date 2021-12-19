import axios from 'axios';
import poke_config from 'constants/poke_config';

const pokeServices = {
  async getPokemons({ offset }: { offset: number }) {
    try {
      const params = {
        offset,
        limit: poke_config.itemPerPage,
      };
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon`, {
        params,
      });

      return res.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
  async getPokemonById(url: string) {
    try {
      const res = await axios.get(url);

      return res.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },
};

export default pokeServices;
