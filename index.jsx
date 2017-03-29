import React from 'react'
import { match } from 'react-router'

const combineClassName = (...args) => {
    let classNames = []
    args.forEach(arg => {
        arg = arg || ''
        classNames = classNames.concat(arg.split(' ').filter(item => !(!item)))
    })
    return classNames.join(' ')
}

export default class extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object,
        store: React.PropTypes.object
    }
    
    get id() {
        return this.props.id || 'main-body'
    }

    renderMain() {
        if (this.props.isLoading) {
            return (<div className="loading" id={this.id}>Loading...</div>)
        } else {
            if (__CLIENT__) {
                if (this.context.router && this.context.store) {
                    match({
                        routes: this.context.router.routes,
                        location: this.context.router.location
                    }, (error, redirectLocation, renderProps) => {
                        for (let component of renderProps.components) {
                            if (component && component.WrappedComponent && component.WrappedComponent.htmlExtends) {
                                component.WrappedComponent.htmlExtends(
                                    {
                                        meta: []
                                    }, {
                                        getState: () => this.context.store.getState()
                                    }
                                )
                            }
                        }
                    })
                }
            }

            return (
                <div id={this.id}>
                    {this.props.children}
                </div>
            )
        }
    }

    render() {
        return (
            <div className={combineClassName(
                'page-container',

                this.props.className,

                this.props.isLoading ? 'is-loading' : '',
                this.props.isReady ? 'is-ready' : '',
                this.props.isError ? 'is-error' : ''
            )}>
                {this.renderMain()}
            </div>
        )
    }
}