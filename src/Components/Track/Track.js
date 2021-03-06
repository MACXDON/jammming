import React from "react";
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    addTrack() {
        let track = this.props.track;

        this.props.onAdd(track);
    }

    removeTrack() {
        let track = this.props.track;

        this.props.onRemove(track);
    }

    renderAction() {
        if(this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>;
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>;
        }
    }

    audioPreview() {
        if(this.props.track.preview_url === null) {
            return (
                <p>Sorry, no preview.</p>
            )
        }

        return (
            <video
                controls
                src={this.props.track.preview_url}
                typeof="audio/mpeg"
                width="200px"
                height="20px"
            >
            </video>
        )
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>
                        {this.props.track.name}
                    </h3>
                    <p>
                        {this.props.track.artist} | {this.props.track.album}
                    </p>
                    {this.audioPreview()}
                </div>
                {this.renderAction()}
            </div>
        )
    }
}

export default Track;