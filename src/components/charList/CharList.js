import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner/>;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>;
        case 'confirmed': 
            return <Component/>
        case 'error': 
            return <ErrorMessage/>
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {
    const [chars, setChars] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, process, setProcess, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, []);

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9){
            ended = true
        }

        setChars(chars => [...chars, ...newChars]);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false): setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'));
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

    const elements = useMemo(() => {
        return (setContent(process, () => renderItem(), newItemLoading))
    }, [process])

    return (
        <div className="char__list">
                {elements}
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