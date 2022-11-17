import React from 'react';
import Color from "color";
import { get } from 'lodash';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error: error }
    }
    componentDidCatch(error, errorInfo) {
        // You can use your own error logging service here
        console.log({ error, errorInfo })
    }
    render() {
        if (this.state.hasError) {
            const { config } = this.props;
            console.log('error', this.state.error)
            return (                
                <div>

                    <div className='page'>
                        <div className='container'>
                            <div className='check'></div><br />
                            {get(this.state, 'error.json.message', get(this.state, 'error.message'))}
                        </div>
                    </div>

                    <style jsx>{`
                        .page {
                            padding: 16px;
                            display: flex;
                            justify-content: center;
                            align-items: top;
                            padding-top: 10vh;
                            width: 100%;
                        }

                        .container {
                            width: 33%;
                            text-align: center;
                            color: ${Color(config.get('color.fgColor')).alpha(0.8)};
                            font-size: 1.2em;
                            padding: 24px;
                            background-color: ${config.get('color.tileBackground')};
                            border-radius: 4px;
                            min-height: 240px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;                                                        
                        }
            
                        .container .check {
                            display: block;
                            width: 48px;
                            height: 48px;
                            margin-bottom: 16px;
                            vertical-align: middle;
                            background-color: ${config.get('color.dangerBgColor')};
                            -webkit-mask: url(/images/triangle-exclamation-solid.svg) no-repeat center;
                            mask: url(/images/triangle-exclamation-solid.svg) no-repeat center;                
                        }                        

                    `}</style>
                    <style jsx global>{`
                        body, html, #__next, #__next > div {
                        width: 100%;
                        height: 100%;
                        }
                    `}</style>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary