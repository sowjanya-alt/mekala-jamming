import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [ ],
      playlistName: "New Playlist",
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track){  // * add track to playlist
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {  // * check if the track to be added already exists 
        return;
    } else {
      let currentPlaylist = this.state.playlistTracks.slice(); // * create a copy of the array
      currentPlaylist.push(track);  //* if the track doesn't exist, push it to the newly copied array
      this.setState({ playlistTracks: currentPlaylist});  // * setting the state of the playlist 
    }
  }

  removeTrack(track){  //* remove the track when the user presses '-' button
    let currentPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id); 
    this.setState({ playlistTracks: currentPlaylist});  //* filtering out the array except the track which is to be removed
  }

  updatePlaylistName(input){   // * changing the playlist name change
    this.setState({ playlistName: input});
  }

  savePlaylist() { //* saving the playlist using POST to spotify api
    let trackURIs = [];  // *array to be passed as argument to spotify
    for(let i= 0; i < this.state.playlistTracks.length; i++) {   //TODO use map instead
      trackURIs.push(this.state.playlistTracks[i].uri);  // * creating an array of track uris to push to user's spotify 
    };

   Spotify.savePlaylist(this.state.playlistName, trackURIs)  // * setting the state after the promise is resolved
      .then(() => this.setState({
        playlistTracks: [],
        playlistName: 'New Playlist'
      }));
    }

  search(term){
    Spotify.search(term).then(items => this.setState({
      searchResults: items  // * setting the state with tracks returned from spotify api
    }));
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
              <SearchBar onSearch={this.search} />    
              <div className="App-playlist">
                <SearchResults searchResults={this.state.searchResults}  
                    onAdd={this.addTrack}
                />
                <Playlist playlist={this.state.playlistName} 
                    playlistTracks={this.state.playlistTracks}  
                    onRemove={this.removeTrack}  
                    onNameChange={this.updatePlaylistName} 
                    onSave={this.savePlaylist} 
                />
              </div>
          </div>
      </div>
    );
  }
}

export default App;
