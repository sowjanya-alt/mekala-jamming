import React, { Component } from 'react';
import './TrackList.css';
import Track from '../Track/Track';

 class TrackList extends Component {
    render() {
        const data = Array.from(this.props.tracks); 
       
        return this.props.tracks ? 
            (
                <div className="TrackList">
                        { 
                            data.map((track) => { 
                                return (<Track track={track} 
                                            key={track.id} 
                                            onAdd={this.props.onAdd} 
                                            onRemove={this.props.onRemove} 
                                            isRemoval={this.props.isRemoval} 
                                        />)
                            })
                        }
                            
                        
                </div>
            )
        :
            null;
    }
}

export default TrackList;