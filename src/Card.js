import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
  render() {
    let style = {
      transform: `rotate(${this.props.rotation}deg) translate(${
        this.props.translation
      })`
    };

    return (
      <div className="Card" style={style}>
        <img src={this.props.image} alt={this.props.alt} />
      </div>
    );
  }
}

export default Card;
