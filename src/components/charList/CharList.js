import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, []);

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9){
            ended = true
        }

        setChars(chars => [...chars, ...newChars]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onError = () => {
        setLoading(false);
        setError(true);   
    }

    const onRequest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const enterOnItem = (id) => {
        itemRefs.current[id].classList.add('char__item_focused');
    }

    const leaveFromItem = () => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_focused'));
    }

    function renderItem() {
        const charList = chars;
        const items =  charList.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onMouseEnter={() => enterOnItem(i)}
                    onMouseLeave={leaveFromItem}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const lies = renderItem();
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? lies : null;


    return (
        <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
            <button 
            onClick = {() => onRequest(offset)}
            disabled={newItemLoading}
            style={{'display': charEnded ? 'none' : 'block'}}
            className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propType = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;