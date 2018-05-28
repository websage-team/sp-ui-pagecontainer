import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { store } from 'super-project/ReactApp'

let currentMetaTags

export default (funcGetPageInfo) => (WrappedComponent) => {
    const getInfo = (store) => {
        if (typeof funcGetPageInfo !== 'function') return

        let infos = funcGetPageInfo(store.getState())
        if (typeof infos !== 'object') infos = {}

        return {
            title: infos.title || '',
            metas: infos.metas || []
        }
    }

    class SuperPage extends Component {
        static contextTypes = {
            store: PropTypes.object
        }
        static onServerRenderHtmlExtend = ({ htmlTool, store }) => {
            const infos = getInfo(store)
            htmlTool.title = infos.title
            htmlTool.metas = infos.metas
        }

        componentDidMount() {
            if (__SERVER__) return

            const infos = getInfo(this.context.store)

            // 替换页面标题
            document.title = infos.title

            // 替换 metas
            const head = document.getElementsByTagName('head')[0]
            if (!Array.isArray(currentMetaTags)) {
                // const exec = /<!--SUPER_METAS_START-->(.*?)<!--SUPER_METAS_END-->/g.exec(head.innerHTML)
                // if (Array.isArray(exec) && exec.index) {
                //     console.log(exec)
                // }
                // head.innerHTML = head.innerHTML.replace(
                //     /<!--SUPER_METAS_START-->(.*?)<!--SUPER_METAS_END-->/g,
                //     `<!--SUPER_METAS_START-->${infos.metas
                //         .filter(meta => typeof meta === 'object')
                //         .map(meta => {
                //             let str = '<meta'
                //             for (var key in meta) {
                //                 str += ` ${key}="${meta[key]}"`
                //             }
                //             str += '>'
                //             return str
                //         }).join('')}<!--SUPER_METAS_END-->`
                // )
                head.innerHTML = head.innerHTML.replace(
                    /<!--SUPER_METAS_START-->(.*?)<!--SUPER_METAS_END-->/g,
                    ''
                )
                currentMetaTags = []
            }

            currentMetaTags.forEach(el => {
                el.parentNode.removeChild(el)
            })
            currentMetaTags = []

            infos.metas
                .filter(meta => typeof meta === 'object')
                .forEach(meta => {
                    const el = document.createElement('meta')
                    for (var key in meta) {
                        el.setAttribute(key, meta[key])
                    }
                    head.appendChild(el)
                    currentMetaTags.push(el)
                })
        }

        render = () => <WrappedComponent {...this.props} />
    }

    return SuperPage
}
