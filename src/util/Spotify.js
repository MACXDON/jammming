const CLIENT_ID = '1ff8d126ccf249d093b1169a7757bd42';
const REDIRECT_URI = 'http://localhost:3000/';

let accessToken;

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken
        }

        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1])

            // clear parameters and allow for new token
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');

            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        }

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, { headers: headers })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                if(!jsonResponse.tracks) {
                    return [];
                }

                return jsonResponse.tracks.items.map(track => {
                    return {
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri,
                        preview_url: track.preview_url
                    }
                })
            })
    },

    savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs.length) return

        const baseURL = 'https://api.spotify.com/v1/';

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };

        let userID;

        // Set userID
        return fetch(`${baseURL}me`, { headers: headers })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                userID = jsonResponse.id;

                // Create a new playlist
                return fetch(`${baseURL}users/${userID}/playlists`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ 
                        name: playlistName
                    }) 
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    const playlistID = jsonResponse.id;
                
                    // Add tracks to new playlist
                    return fetch(`${baseURL}users/${userID}/playlists/${playlistID}/tracks`, {
                        headers: headers,
                        method: 'POST',
                        body: JSON.stringify({
                            uris: trackURIs
                        })
                    })
                })

            })  
    }
}

// function getAccessToken() {
//     const client_id = CLIENT_ID;
//     const redirect_uri = REDIRECT_URI;
//     const response_type = 'code';
//     const baseURL = 'https://api.spotify.com/v1/';
//     const authorize = 'authorize';
// }

export default Spotify;