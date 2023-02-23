import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {  
        let playlistName = event.target.value;
        this.props.onNameChange(playlistName);
    }

    render() {
        return(
            <div className="Playlist">
                <input onChange={this.handleNameChange} defaultValue={'New Playlist'} /> 
                <TrackList tracks={this.props.playlistTracks}  
                    onRemove={this.props.onRemove} 
                    isRemoval={true} 
                />
                <a className="Playlist-save" onClick={this.props.onSave} >SAVE TO SPOTIFY</a>
            </div>
        );
    }
}

export default Playlist;