import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Session } from 'meteor/session';
import FlipMove from 'react-flip-move';

import { Links } from '../api/links';
import LinksListItem from './LinksListItem';

export default class LinksList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            links: []
        };
    }
    componentDidMount() {
        console.log('componentDidMount LinksList');
        this.linksTracker = Tracker.autorun(() => {
            Meteor.subscribe('links');
            let links = Links.find({
                visible: Session.get('showVisible')
            }).fetch();
            this.setState({ links })
        });
    }
    componentWillUnmount() {
        console.log('componentWillUnmount LinksList');
        this.linksTracker.stop();
    }
    renderLinksListItem() {
        // if there are no links in links array
        if(this.state.links.length === 0) {
            return (
                <div className="item">
                    <p className="item__status-message">There are no links yet</p>
                </div>
            );
        }

        return this.state.links.map((link) => {
            const shortUrl = Meteor.absoluteUrl(link._id);
            return (
                <LinksListItem key={link._id} shortUrl={shortUrl} {...link}/>
            );
        });
    }
    render() {
        return (
            <div>
                <FlipMove maintainContainerHeight={true}>
                    {this.renderLinksListItem()}
                </FlipMove>
            </div>
        );
    }
};