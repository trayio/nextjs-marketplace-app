import classNames from "classnames"
import Color from "color"

import Loader from "./Loader"
import { ConfigConsumer } from '../utils/config'

export default function Button({ children, preloading, loading, onClick, bgColor, fgColor }) {
    return (
        <ConfigConsumer>
        { config => (        
            <div className={classNames('button', { loading: loading, preloading: preloading })} onClick={onClick}>
                {children}
                {loading ? <Loader fgColor={Color(fgColor).alpha(0.7)}/> : null}
                <style jsx>{`              
                    .button {
                        position: relative;
                        display: inline-block;
                        border-radius: 4px;
                        color: ${fgColor};
                        background-color: ${bgColor};
                        line-height: 1.4em;
                        font-size: 0.9em;
                        padding: 0.4em 0.8em;
                        cursor: pointer;
                        font-weight: 300;
                    }

                    .button:hover {
                        background-color: ${Color(bgColor).darken(0.2)};
                    }

                    .button.loading {
                        color: transparent;
                    }

                    .button.preloading {
                        color: rgba(0,0,0,0);
                        border-radius: 2px;
                        background-color: ${Color(bgColor).alpha(0.1)};
                        background: linear-gradient(to right, ${Color(bgColor).alpha(0.1)} 10%, ${Color(config.get('color.highlightBgColor')).alpha(0.1).darken(0.5)} 18%, ${Color(config.get('color.highlightBgColor')).alpha(0.1)} 33%);
                        background-size: 300px 104px;
                        animation-name: shimmerbutton;
                        animation-duration: 1.25s;
                        animation-fill-mode: forwards;
                        animation-iteration-count: infinite;
                        animation-timing-function: linear;
                        position: relative;                                     
                    }    
                    
                    @keyframes shimmerbutton {
                        0%{
                            background-position: -150px 0
                        }
                        100%{
                            background-position: 150px 0
                        }
                    }                 
                                        
                `}</style>
            </div>
        )}
        </ConfigConsumer>        
    )
}