import { useHttp } from '../hooks/http.hook'

const useMarvelService = () => {
    const {loading, request, error} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=b4ad9f002793ed237f5520549cde7db5';//5
    const _BaseOffsetForChar = 210;
    const _BaseOffsetForComics = 1;

    const getAllCharacters = async (offset = _BaseOffsetForChar) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComic(res.data.results[0]);
    }

    const getAllComics = async (offset = _BaseOffsetForComics) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const _transformComic = (comic) => {
        return {    
            id: comic.id,        
            name: comic.title,
            description: comic.description ? comic.description : 'description is missing',
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            language: comic.textObjects.language || 'en-us',
            pageCount: comic.pageCount,
            price: comic.prices[0].price ? `${comic.prices[0].price}$` : 'Not avaible'
        }
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

    return {loading, error, getAllCharacters, getCharacter, getAllComics, getComic}
}

export default useMarvelService;