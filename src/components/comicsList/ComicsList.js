import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';


const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(1);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics.length < 8){
            ended = true
        }

        setComics(comics => [...comics, ...newComics]);
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false): setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded);
    }

    function renderItem() {
        const comicsList = comics;
        const items =  comicsList.map((item, i) => {
            return (
                <li 
                    className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="comics__item-img"/>
                        <div className="comics__item-name">{item.name}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const lies = renderItem();
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
                {errorMessage}
                {spinner}
                {lies} 
            <button 
            onClick = {() => onRequest(offset)}
            disabled={newItemLoading}
            style={{'display': comicsEnded ? 'none' : 'block'}}className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;