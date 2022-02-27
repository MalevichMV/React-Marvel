import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Page404 from '../pages/404';

import './singleComicPage.scss';

const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null)

    const {loading, error, getComic} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId]);

    const updateComic = () => {
        getComic(comicId)
            .then(onComicLoaded);
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const errorPage = error ? <Page404/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorPage}
            {spinner}
            {content}
        </> 
    )
}

const View = ({comic}) => {
    const {name, description, thumbnail, language, pageCount, price} = comic;

    return(
        <div className="single-comic">
            <img src={thumbnail} alt={name} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{name}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{`${pageCount} pages`}</p>
                <p className="single-comic__descr">{`Language: ${language}`}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;