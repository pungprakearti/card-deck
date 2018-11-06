import React, { Component } from 'react';
import axios from 'axios';
import Card from './Card';
import uuid from 'uuid/v4';
import './Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cards: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    let deck = await axios.get(
      'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
    );

    this.setState(
      {
        deckID: deck.data.deck_id,
        remaining: deck.data.remaining,
        loading: false
      },
      this.startTimer
    );
  }

  startTimer() {
    let timerID = setInterval(this.handleClick, 500);
    this.setState({ timerID: timerID });
  }

  async handleClick() {
    console.log('click');

    let card = await axios.get(
      `https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`
    );

    card.data.cards[0].rotation = this.getRandomRotation();
    card.data.cards[0].translation = this.getRandomTranslation();
    card.data.cards[0].key = uuid();

    this.setState(
      st => ({
        cards: [...st.cards, card.data.cards[0]],
        remaining: card.data.remaining
      }),
      () => {
        if (!this.state.remaining) clearInterval(this.state.timerID);
      }
    );
  }

  getRandomRotation() {
    return Math.random() * 360;
  }

  getRandomTranslation() {
    let x = Math.floor(Math.random() * 100);
    let y = Math.floor(Math.random() * 100);
    return `${x}px, ${y}px`;
  }

  render() {
    let button = <button onClick={this.handleClick}>GIMME A CARD</button>;
    let endMsg = "You've used up the whole deck!";
    if (this.state.loading) {
      return <h1>LOADING</h1>;
    }
    return (
      <div className="Board">
        {this.state.remaining ? button : endMsg}
        <div className="Board-container">
          {this.state.cards.map(card => {
            return (
              <Card
                key={card.key}
                image={card.image}
                rotation={card.rotation}
                alt={`${card.value} of ${card.suit}`}
                translation={card.translation}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Board;
