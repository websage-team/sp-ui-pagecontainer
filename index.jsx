import React from 'react'
import PropTypes from 'prop-types'
import { match } from 'react-router'
import HTMLTool from 'super-project/ReactApp/HTMLTool'

const combineClassName = (...args) => {
    let classNames = []
    args.forEach(arg => {
        arg = arg || ''
        classNames = classNames.concat(arg.split(' ').filter(item => !(!item)))
    })
    return classNames.join(' ')
}

/**
 * React component: PageContainer
 * 
 * @export
 * @class
 * @extends {React.Component}
 * 
 * @props {*string} className
 * @props {*string} id
 * @props {*boolean} isLoading - if true, will only render (<div className="loading">Loading...</div>)
 * @props {*boolean} isReady - only for className
 * @props {*boolean} isError - only for className
 * @props {*(string|Component)} contentLoading - content/component for loading
 * @props {*function} render - will run this function when renderMain() runs
 */
export default class SPPageContainer extends React.Component {
    static contextTypes = {
        router: PropTypes.object,
        store: PropTypes.object
    }

    renderMain() {
        if (typeof this.props.render === 'function') this.props.render(this)

        if (this.props.isLoading) {
            return <div className="sp-pagecontainer-body loading">
                {this.props.contentLoading || 'Loading...'}
            </div>
        } else {
            if (__CLIENT__) {
                if (this.context.router && this.context.store) {
                    match({
                        routes: this.context.router.routes,
                        location: this.context.router.location
                    }, (error, redirectLocation, renderProps) => {
                        for (let component of renderProps.components) {
                            if (component && component.WrappedComponent && component.WrappedComponent.onServerRenderHtmlExtend) {
                                component.WrappedComponent.onServerRenderHtmlExtend({
                                    htmlTool: new HTMLTool(),
                                    store: this.context.store
                                })
                            }
                        }
                    })
                }
            }

            return (
                <div className="sp-pagecontainer-body">
                    {this.props.children}
                </div>
            )
        }
    }

    render() {
        return (
            <div className={combineClassName(
                'sp-pagecontainer',

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
