import React from "react";
import './SearchBar.css'

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: ''
        }

        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(e) {
        const term = e.target.value;

        this.setState({ term: term });

        /*****  Trigger this.search()
         **** NOTE: May not work ******/

        this.search();
    }

    render() {
        return (
            <div className="SearchBar">
                <input
                    onChange={this.handleTermChange}
                    placeholder="Enter A Song, Album, or Artist" 
                />
                <button className="SearchButton">SEARCH</button>
            </div>
        )
    }
}