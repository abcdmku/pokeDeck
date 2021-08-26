import {React, useState, useEffect} from 'react';
import { supabase, pokemon } from "../../lib/api";
import { superTypes, subTypes, types } from "../../lib/pokeTypes";
import Pagination from '@material-ui/lab/Pagination';
import {Slider, CircularProgress, Button, Select, MenuItem, FormControl, Badge, IconButton, InputLabel} from '@material-ui/core';
import {AddCircle, CardGiftcardRounded, ZoomOutMap}from '@material-ui/icons';


function Deck(props){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [sets, setSets] = useState([])

  // search
  const [set, setSet] = useState("*")
  const [type, setType] = useState("*")
  const [subType, setSubType] = useState("*")
  const [superType, setSuperType] = useState("*")


  //hp:[${minHP} TO ${maxHP}]
  const [minHP, setminHP] = useState("0")
  const [maxHP, setmaxHP] = useState("*")

  // results
  const [searchMetadata, setsearchMetadata] = useState([])
  const [cards, setCards] = useState([])
  const [pageNumber, setPageNumber] = useState(1)

  // deck
  const [deck, setDeck] = useState({ name:"", types:[], cards:[] })

    
  useEffect(() => {
    setLoading(true)
    pokemon.card.where({ q: `set.id:${set} ${ superType === "Pokemon" ? `types:${type}` : ""} subtypes:${subType} supertype:${superType}`, pageSize: 18, page: pageNumber })
    .then(result => {
      setsearchMetadata(result)
      setCards(result.data)
    })
    .then(() => setLoading(false))
    .catch(setError)
  }, [pageNumber, minHP, maxHP, set, type, subType, superType])

  useEffect(() => {
    pokemon.set.all()
    .then(sets => {
      setSets(sets)
      })
  },[]);

  function addToDeck(card) {
    let TempDeck = deck;
    let cardIndex = getObjectIndex(deck.cards, card.id)

    if (cardIndex !== -1)
      TempDeck.cards[cardIndex].count++
    else
      TempDeck.cards.push({ id:card.id, name: card.name, rarity: card.rarity, image:card.images.small, count: 1})
    if (card.types) {
      card.types.forEach(type => {
        if(!TempDeck.types.includes(type))
          TempDeck.types.push(type)
      })
    }
    setDeck(TempDeck)
  }

  const saveDeck = async () => {
    const { data, error } = await supabase
    .from('decks')
    .insert([
      { deck: deck,
       user_id: props.user.id }
    ])
  }


  function getObjectIndex(arr, cardID) {
    let i = 0;
    for(let value of arr) {
      if (value.id === cardID) return i;
      i++;
    }
    return -1;
  }

  function amountPages() {
    return searchMetadata.totalCount ? Math.ceil(searchMetadata.totalCount / searchMetadata.pageSize) : 0
  }

  function ReplaceImage(props) {
    const [didLoad, setLoad] = useState(false);
    const src = didLoad ? props.replace : props.placeholder;  
    return <img className="rounded-3" src={src} onLoad={() => setLoad(true)} alt={props.alt} width="auto"/>;
  }

  return (
    <>
    <div className="row">
      <div className="col-2 ps-5 pe-4 pt-4 bg-gray-200">

        <FormControl className="col-12 mb-4">
          <InputLabel id="select-set">Set</InputLabel>
          <Select labelId="select-set"id="demo-simple-select" value={set} onChange={(e,value)=> setSet(value.props.value)}> 
            <MenuItem width={"300px"} value={"*"}>All</MenuItem>
            {!sets ? <MenuItem>Loading...</MenuItem> : sets.map((set) => <MenuItem key={set.id} value={set.id}>{set.name}</MenuItem>)}
          </Select>
        </FormControl>
        { superType === "Pokemon" ? 
        <FormControl className="col-12 mb-4">
          <InputLabel id="select-type">Type</InputLabel>
          <Select labelId="select-type"id="demo-simple-select" value={type} onChange={(e,value)=> setType(value.props.value)}> 
            <MenuItem width={"300px"} value={"*"}>All</MenuItem>
            {types.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </Select>
        </FormControl> : "" }
        <FormControl className="col-12 mb-4">
        <InputLabel id="select-subtype">Subtype</InputLabel>
          <Select labelId="select-subtype"id="demo-simple-select" value={subType} onChange={(e,value)=> setSubType(value.props.value)}> 
            <MenuItem width={"300px"} value={"*"}>All</MenuItem>
            {subTypes.map((subType) => <MenuItem key={subType} value={subType}>{subType}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl className="col-12 mb-4">
          <InputLabel id="select-super-type">Super Type</InputLabel>
          <Select labelId="select-super-type" id="demo-simple-select" value={superType} onChange={(e,value)=> setSuperType(value.props.value)}> 
            <MenuItem width={"300px"} value={"*"}>All</MenuItem>
            {superTypes.map((superType) => <MenuItem key={superType} value={superType}>{superType}</MenuItem>)}
          </Select>
        </FormControl>
      </div>
      <div className="col-10 mt-4 pe-5 ps-4">
        <div className="row">
          { loading ? 
          <div className="mt-auto mb-auto"><div className="hd-flex justify-content-center"></div>
            <CircularProgress size={60}/>
          </div>
          :
          cards.map((card) =>
          <div in={!loading} key={card.id} className="col-2 mb-3">
            <Badge badgeContent={
              <IconButton size="small" onClick={event => addToDeck(card)}>
                <AddCircle color={"#3f3"}/>
              </IconButton>
              } aria-label="add" >
                <ReplaceImage replace={card.images.small} placeholder={process.env.PUBLIC_URL + '/back-s.png'} alt={card.name} />
            </Badge>
          </div>
          )}
        </div>
        <div className="row">
          <div className="d-flex justify-content-center m-3">
            <Pagination count={amountPages()} onChange={(event,val)=> setPageNumber(val)} showFirstButton showLastButton />
          </div>
        </div>
      </div>
    </div>
    <footer class="footer mt-auto p-3 bg-light">
      <div className="row">
      <div className="col-12 mb-3">
        <span className="h4">Deck Types: </span>
      {deck.types.map((type) =>
            <img key={type} className="d-inline ms-1 pb-2" src={process.env.PUBLIC_URL + `/energy-icon/${type}.png`} alt={type} width="35px"/>
        )}
          <div class="float-end">
          <Button variant="contained" color="primary"  onClick={saveDeck}>Save Deck</Button>
          </div>
        </div>
      </div>
      <div className="row">
        {deck.cards.map((card) =>
        <div key={card.id} className="col-2 mb-3">
          <Badge color={"secondary"} badgeContent={card.count} aria-label="add" >
            <ReplaceImage replace={card.image} placeholder={process.env.PUBLIC_URL + '/back-s.png'} alt={card.name} />
          </Badge>
        </div>
        )}
      </div>
    </footer>
    </>
  )
}

export default Deck;
