import React from 'react';
import PropTypes from 'prop-types';
import { Panel, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Markdown from 'react-remarkable';

import ModalTrigger from './ModalTrigger';
import { t } from '../locales';

const $ = window.$ = require('jquery');

const propTypes = {
  animation: PropTypes.bool,
  type: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
};

const defaultProps = {
  animation: true,
  type: '',
  identifier: '',
};

const remarkableOptions = {
  html: false,
  breaks: true,
  linkify: true,
};

export default class DisplayInfoButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: false,
    };
    this.beforeOpen = this.beforeOpen.bind(this);
    this.fetchQuery = this.fetchQuery.bind(this);
  }

  onInfoUrlSuccess(data) {
    this.setState({
      info: data,
    });
  }

  getUrl() {
    return '/superset/info/' + this.props.type + '/' + this.props.identifier + '/';
  }

  fetchQuery() {
    this.setState({ isLoading: true, });
    $.ajax({
      type: 'GET',
      url: this.getUrl(),
      success: (data) => {
        this.setState({
          info: data,
          isLoading: false,
          error: null,
        });
      },
      error: (data) => {
        this.setState({
          error: data.responseJSON ? data.responseJSON.error : t('Error...'),
          isLoading: false,
        });
      },
    });
  }
  beforeOpen() {
    if (
      ['loading', null].indexOf(this.state.isLoading) >= 0
      || !this.state.info || !this.state.info.created
    ) {
      this.fetchQuery();
    }
  }
  renderModalBody() {
    if (this.state.isLoading) {
      return (<img
        className="loading"
        alt="Loading..."
        src="/static/assets/images/loading.gif"
      />);
    } else if (this.state.error) {
      return <pre>{this.state.error}</pre>;
    } else if (this.state.info) {
      var index = 1;
      return (
        <div className="info popup">
          <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
            {this.state.info.description &&
            <Tab eventKey={index++} title={t('Details')}>
              <Panel>
                <Row>
                  <hr />
                  <Col>
                    <Markdown
                      source={this.state.info.description}
                      options={remarkableOptions}
                    />
                  </Col>
                </Row>
              </Panel>
            </Tab>
            }
            <Tab eventKey={index++} title={t('General')}>
              <Panel>
                <Row>
                  <Col md={2}><h5>Name</h5></Col>
                  <Col><h5>{this.state.info.name}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Owner</h5></Col>
                  <Col><h5>{this.state.info.owner}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Created By</h5></Col>
                  <Col><h5>{this.state.info.created_by}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Updated By</h5></Col>
                  <Col><h5>{this.state.info.changed_by}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Created</h5></Col>
                  <Col><h5>{this.state.info.created}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Updated</h5></Col>
                  <Col><h5>{this.state.info.updated}</h5></Col>
                </Row>
              </Panel>
            </Tab>
            {this.state.info.team.name &&
            <Tab eventKey={index++} title={t('Team')}>
              <Panel>
                <Row>
                  <Col md={2}><h5>Name</h5></Col>
                  <Col><h5>{this.state.info.team.name}</h5></Col>
                </Row>
                <Row>
                  <Col md={2}><h5>Email</h5></Col>
                  <Col><h5>{this.state.info.team.email}</h5></Col>
                </Row>
                <Row>
                  <hr />
                  <Col md={2}>
                    <Markdown
                      source={this.state.info.team.notes}
                      options={remarkableOptions}
                    />
                  </Col>
                </Row>
              </Panel>
            </Tab>
            }
          </Tabs>
        </div>
      );
    }
    return null;
  }
  render() {
    return (
      <ModalTrigger
        animation
        isButton
        triggerNode={<span>Info</span>}
        modalTitle={t(
            this.props.type.charAt(0).toUpperCase() +
            this.props.type.substr(1).toLowerCase() +
            ' Information'
        )}
        bsSize="large"
        beforeOpen={this.beforeOpen}
        onEnter={this.getUrl.bind(this)}
        modalBody={this.renderModalBody()}
      />
    );
  }
}

DisplayInfoButton.propTypes = propTypes;
DisplayInfoButton.defaultProps = defaultProps;
