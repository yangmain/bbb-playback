import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import { chat as config } from 'config';
import Message from './message';
import { getScrollTop } from 'utils/data';
import './index.scss';

const intlMessages = defineMessages({
  aria: {
    id: 'player.chat.wrapper.aria',
    description: 'Aria label for the chat wrapper',
  },
  title: {
    id: 'player.chat.title',
    description: 'Chat title',
  },
});

export default class Chat extends Component {
  constructor(props) {
    super(props);

    this.id = 'chat';
  }

  componentDidMount() {
    this.handleAutoScroll();
  }

  shouldComponentUpdate(nextProps) {
    const { currentDataIndex } = this.props;

    if (currentDataIndex !== nextProps.currentDataIndex) {
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    this.handleAutoScroll();
  }

  handleAutoScroll() {
    if (!config.scroll) return;

    // Auto-scroll can start after getting the first and current nodes
    if (this.firstNode && this.currentNode) {
      const { parentNode } = this.currentNode;

      parentNode.scrollTop = getScrollTop(this.firstNode, this.currentNode, config.align);
    }
  }

  handleOnClick(timestamp) {
    const { player } = this.props;

    if (!player) return null;

    player.currentTime(timestamp);
  }

  // Set node as ref so we can manage auto-scroll
  setRef(node, index) {
    const { currentDataIndex } = this.props;

    if (index === 0) {
      this.firstNode = node;
    }

    if (index === currentDataIndex) {
      this.currentNode = node;
    }
  }

  renderTitle() {
    const { intl } = this.props;

    return (
      <div className="title">
        {intl.formatMessage(intlMessages.title)}
      </div>
    );
  }

  renderMessages() {
    const {
      chat,
      currentDataIndex,
    } = this.props;

    return chat.map((item, index) => {
      const {
        hyperlink,
        message,
        name,
        timestamp,
      } = item;

      const active = index <= currentDataIndex;

      return (
        <span ref={node => this.setRef(node, index)}>
          <Message
            active={active}
            hyperlink={hyperlink}
            name={name}
            onClick={() => this.handleOnClick(timestamp)}
            text={message}
            timestamp={timestamp}
          />
        </span>
      );
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <div
        aria-label={intl.formatMessage(intlMessages.aria)}
        aria-live="polite"
        className="chat-wrapper"
        id={this.id}
      >
        {this.renderTitle()}
        <div className="list">
          <div className="message-wrapper">
            {this.renderMessages()}
          </div>
        </div>
      </div>
    );
  }
}
