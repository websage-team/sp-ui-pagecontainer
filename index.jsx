import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { store } from 'super-project/ReactApp'

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
            const infos = getInfo(this.context.store)

            // 替换页面标题
            document.title = infos.title

            // 替换 metas
            const head = document.getElementsByTagName('head')[0]
            head.innerHTML = head.innerHTML.replace(
                /<!--SUPER_METAS_START-->(.*?)<!--SUPER_METAS_END-->/g,
                `<!--SUPER_METAS_START-->${infos.metas
                    .filter(meta => typeof meta === 'object')
                    .map(meta => {
                        let str = '<meta'
                        for (var key in meta) {
                            str += ` ${key}="${meta[key]}"`
                        }
                        str += '>'
                        return str
                    }).join('')}<!--SUPER_METAS_END-->`
            )
        }

        render = () => <WrappedComponent {...this.props} />
    }

    return SuperPage
}