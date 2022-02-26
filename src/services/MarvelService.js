import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
    const {loading, request, error} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=b4ad9f002793ed237f5520549cde7db5';//5
    const _BaseOffset = 210;

    const getAllCharacters = async (offset = _BaseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const _transformCharacter = (char) => {
        if (char.description.length > 200)
            char.description = char.description.slice(0, 200) + '...';
        return {    
            id: char.id,        
            name: char.name,
            description: char.description ? char.description : 'description is missing',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    return {loading, error, getAllCharacters, getCharacter}
}

export default useMarvelService;