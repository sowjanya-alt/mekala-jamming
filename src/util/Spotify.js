const clientId = '76017df6003345edb53f74881ae68515';
const redirectUri = 'https://quickplaylists.netlify.com/';


let accessToken; //* variable to store user access token
let expiresIn;

const Spotify = {
    getAccessToken() {   //* method to get the access token
        if (accessToken) {
            return accessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
            expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

            window.setTimeout(() => accessToken = '', expiresIn * 1000);  // * setting the expire time for access token
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        } else {
            let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = url;
        }
    },

    search(searchTerm) { // * searches the spotify api and returns tracks
        let endpoint = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`; // * endpoint for spotify api search 
        return fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${this.getAccessToken()}`
            } // * returns the access token
        }).then(response => {
            if (response.ok) {
                const jsonResponse = response.json();  // * convert api response into json format
                return jsonResponse;
            }
            throw new Error('Request Failed');
        }, networkError => {
            console.log(networkError.message);
        }).then(jsonResponse => {
            if (jsonResponse.tracks.items) {    // * check if items array exists
                const tracks = jsonResponse.tracks.items.map(track => {   // * mapping over the items array and returning tracks object
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }
                })
                return tracks;
            }

        });
    },

    savePlaylist(addPlaylist, trackURIs) {  //* saving the playlist with the state of playlist and an array of track uris
        if ((!addPlaylist) || (!trackURIs)) { //* check if either of them is falsy
            return;
        }

        let userToken = this.getAccessToken();

        let userID = '';
        let playlistID = '';

        let url = `https://api.spotify.com/v1/me`;  

        return fetch(url, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            }).then(response => response.json())
            .then(jsonResponse => userID = jsonResponse.id) 
            .then(() => {
                const playlistEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`; 
                return fetch(playlistEndpoint, {  
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${userToken}`
                        },
                        body: JSON.stringify({
                            name: addPlaylist
                        })
                    }).then(response => response.json())
                    .then(jsonResponse => {
                        playlistID = jsonResponse.id 
                    }).then(() => { 
                        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${userToken}`
                            },
                            body: JSON.stringify({
                                uris: trackURIs
                            })
                        }).then(response => response.json().then(jsonResponse => {
                            playlistID = jsonResponse.id;
                        }));
                    });

            }, networkError => console.log(networkError.message));
    }

};

export default Spotify;