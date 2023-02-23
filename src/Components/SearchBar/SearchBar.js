import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {  // * creating the state for term searched
            term: ''
        };
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    search(term) {  
        this.props.onSearch(term);  //* invoking the function declared as props from App component
    }

    handleTermChange(event) {    
        this.setState({ term: event.target.value});
    }

    handleSubmit(e) { 
        this.search(this.state.term);
        e.preventDefault();
    }

    handleKeyPress(e) {
        if(e.key === 'Enter') {
            this.search(this.state.term);
        }
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange} 
                    onKeyPress={this.handleKeyPress}
                    placeholder="Enter a Song, Album Or Artist" 
                />
                <a onClick={this.handleSubmit} >SEARCH</a>
            </div>

        );
    }
}

export default SearchBar;
