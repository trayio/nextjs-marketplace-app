import { useState } from "react";
import classNames from "classnames"
import Color from "color"
import pluralize from "pluralize";
import { map, isEmpty, get, without } from "lodash";

import Button from "./Button";
import { ConfigConsumer } from '../utils/config'

export default function SolutionTile({ loading, isInstance, solution, instances, onConnect, onDisconnect, onEnable, onDisable, tagFilters }) {

    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);
    const [toggling, setToggling] = useState(false);

    const hasInstances = !isEmpty(instances);
    const forceUniqueInstance = ['yes', 'true'].indexOf(get(solution, 'customFieldsMap.forceunique')) != -1;
    const disableAutoEnable = ['yes', 'true'].indexOf(get(solution, 'customFieldsMap.disableautoenable')) != -1;
    const isInstanceEnabled = forceUniqueInstance && get(instances, '0.enabled');

    // Fallback for icon, as still in use in a lot of test solutions
    const imageUrl = get(solution, 'customFieldsMap.image', get(solution, 'customFieldsMap.icon'));

    // console.log(get(solution, 'title'), 'forceUniqueInstance', forceUniqueInstance, customFields)    

    if (hasInstances) {
        console.log(get(solution, 'title'), 'has instances', solution, get(instances, '0.enabled'))    
    }

    const onConnectClick = async () => {
        if (onConnect && !connecting) {
            setConnecting(true);
            await onConnect()
            setConnecting(false);
        }
    }

    const onDisconnectClick = async () => {
        if (onDisconnect && !disconnecting) {
            setDisconnecting(true);
            await onDisconnect()
            setDisconnecting(false);
        }
    }
    
    const onEnableClick = async () => {
        console.log('onEnableClick')
        if (onEnable && !toggling) {
            setToggling(true);
            await onEnable()
            setToggling(false);
        }
    }

    const onDisableClick = async () => {
        console.log('onDisableClick')
        if (onDisable && !toggling) {
            setToggling(true);
            await onDisable()
            setToggling(false);
        }
    }    

    const content = config => {

        const fgCol = config.get('color.fgColor');
        const tileBg = config.get('color.tileBackground');

        const ctaText = isInstance ? config.get('content.modifyCTAText') : config.get('content.connectCTAText');
        const ctaDisconnectText = config.get('content.disconnectCTAText');
        const enableText = config.get('content.enableText');
        const disableText = config.get('content.disableText');

        const ctaBgCol = config.get('color.highlightBgColor');
        const ctaFgCol = config.get('color.highlightFgColor');
        const ctaConnectedBgCol = config.get('color.successBgColor');
        const ctaConnectedFgCol = config.get('color.successFgColor');        
        const ctaEnableBgCol = config.get('color.successBgColor');
        const ctaEnableFgCol = config.get('color.successFgColor');
        const ctaDangerBgCol = config.get('color.dangerBgColor');
        const ctaDangerFgCol = config.get('color.dangerFgColor');        


        // console.log(get(solution, 'title'), 'hasInstances', hasInstances, context)
        
        return (
            <div className={classNames('tile', { loading: loading })}>
                {loading ? (
                    <>
                        <header>
                            {config.get('features.image') ? (
                                <div className="image">
                                    <div className="shimmer"></div>
                                </div>
                            ) : null}
                            <h2 className="shimmer"></h2>
                        </header>
                        <section>
                            <p className="shimmer"></p>
                            <p className="shimmer"></p>
                        </section>
                        {config.get('features.tags') ? (
                            <section className="tags">
                                <a className="shimmer"></a>
                                <a className="shimmer"></a>
                                <a className="shimmer"></a>
                            </section>
                        ) : null}
                        <footer>
                            <span className="context"></span>
                            <span className="button"><Button preloading={true} bgColor={ctaBgCol} fgColor={ctaFgCol} >{ctaText}</Button></span>
                        </footer>
                    </>
                ) : (
                    <>
                        <header>
                            {config.get('features.image') ? (
                                <div className="image">
                                    <div className={classNames({'empty': !imageUrl})} style={{backgroundImage: `url(${imageUrl})`}}></div>
                                </div>
                            ) : null}                            
                            <h2>{solution.title}</h2>
                        </header>
                        <section className="description">
                            <p>{solution.description}</p>
                        </section>
                        {config.get('features.tags') ? (
                            <section className="tags">
                                {map(without.apply(this, [solution.tags].concat(tagFilters)), t => (
                                    <a key={t}>{t}</a>
                                ))}
                            </section>
                        ) : null}
                        <footer>
                            { (!isInstance && hasInstances && !forceUniqueInstance) ? <span className="context">{`${instances.length} ${pluralize(config.get('content.connectionText'), instances.length)}`}</span> : null }
                            { (!isInstance && hasInstances && forceUniqueInstance) ? <span className="context"><i className="check"></i>{config.get('content.connectedText')}</span> : null }
                            {
                                isInstance || (forceUniqueInstance && !hasInstances) || (!forceUniqueInstance) ? (
                                    <span className="button"><Button loading={connecting} onClick={onConnectClick} bgColor={ctaBgCol} fgColor={ctaFgCol}>{ctaText}</Button></span>
                                ) : null
                            }
                            {
                                isInstance || (forceUniqueInstance && hasInstances) ? (
                                    <span className="button"><Button loading={disconnecting} onClick={onDisconnectClick} bgColor={ctaDangerBgCol} fgColor={ctaDangerFgCol} >{ctaDisconnectText}</Button></span>
                                ) : null
                            }    
                            {
                                (isInstance && disableAutoEnable && !isInstanceEnabled) || (!isInstance && forceUniqueInstance && disableAutoEnable && hasInstances && !isInstanceEnabled) ? (
                                    <span className="button"><Button loading={toggling} onClick={onEnableClick} bgColor={ctaEnableBgCol} fgColor={ctaEnableFgCol} >{enableText}</Button></span>
                                ) : null
                            } 
                            {
                                (isInstance && disableAutoEnable && isInstanceEnabled) || (!isInstance && forceUniqueInstance && disableAutoEnable && hasInstances && isInstanceEnabled) ? (
                                    <span className="button"><Button loading={toggling} onClick={onDisableClick} bgColor={ctaDangerBgCol} fgColor={ctaDangerFgCol} >{disableText}</Button></span>
                                ) : null
                            }                                                    
                        </footer>                                  
                    </>
                )}

                <style jsx>{`
                    .tile {
                        padding: 24px;
                        border-radius: 4px;
                        background-color: ${tileBg};
                        display: flex;
                        flex-direction: column;
                    }

                    .tile header {
                        display: flex;
                        flex-direction: column;
                        flex-grow: 1;
                    }

                    .tile h2 {
                        color: ${fgCol};
                        margin: 0 0 0.6em 0;
                        font-size: 1.2em;
                        line-height: 1.2em;
                        min-height: 1.2em;
                    }

                    .tile header .image {
                        display: block;
                        width: 100%;
                        height: ${config.get('layout.image.height')};
                        max-height: ${config.get('layout.image.maxHeight')};
                        margin-bottom: 24px;
                        text-align: center;
                    }

                    .tile header .image div {
                        display: inline-block;
                        width: 100%;
                        max-width: ${config.get('layout.image.maxWidth')};
                        height: ${config.get('layout.image.height')};
                        max-height: ${config.get('layout.image.maxHeight')};                        
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                    }

                    .tile header .image div.empty {
                        background-color: ${Color(fgCol).alpha(0.4)};
                        -webkit-mask: url(/images/image-solid.svg) no-repeat center;
                        mask: url(/images/image-solid.svg) no-repeat center;                        
                    }

                    .tile section.description {
                        flex-grow: 1;
                        margin-bottom: 0.4em;
                    }

                    .tile p {
                        color: ${Color(fgCol).alpha(0.8)};
                        margin: 0 0 0.6em 0;
                        font-size: 0.9em;
                        line-height: 1.2em;
                        min-height: 1.2em;
                    }

                    .tile section.tags {
                        margin: 0 0 0.6em 0;
                    }

                    .tile section.tags a {
                        display: inline-block;
                        margin-right: 0.4em;
                        line-height: 1.2em;
                        min-height: 1.2em;
                        padding: 0.2em 0.6em;
                        font-size: 0.8em;
                        border-radius: 2px;
                        color: ${fgCol};
                        background-color: ${Color(tileBg).darken(0.1)};
                        font-weight: 300;
                        cursor: pointer;
                    }

                    .tile section.tags a.shimmer {
                        width: 100px;
                    }

                    .tile section.tags a:hover {
                        background-color: ${Color(tileBg).darken(0.2)};
                    }

                    .tile footer {
                        text-align: right; 
                        display: flex;  
                        justify-content: flex-end;
                        align-items: center;                  
                    }

                    .tile footer .context {
                        flex-grow: 1;
                        color: ${Color(fgCol).alpha(0.7)};
                        font-size: 0.8em;   
                        text-align: left;                   
                    }

                    .tile footer .context .check {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        margin-right: 6px;
                        vertical-align: middle;
                        background-color: ${ctaConnectedBgCol};
                        -webkit-mask: url(/images/circle-check-solid.svg) no-repeat center;
                        mask: url(/images/circle-check-solid.svg) no-repeat center;
                    }

                    .tile footer .button {
                        margin-left: 12px;
                        flex-grow: 0;
                    }

                    .tile.loading .image .shimmer {
                        border-radius: 2px;
                        display:block;
                        background-color: ${Color(fgCol).alpha(0.1)};
                        background: linear-gradient(to right, ${Color(fgCol).alpha(0.1)} 10%, ${Color(fgCol).alpha(0.1).darken(0.8)} 18%, ${Color(fgCol).alpha(0.1)} 33%);
                        background-size: 1200px 128px;
                        animation-name: shimmerimage;
                    }                    

                    .tile.loading h2 {
                        border-radius: 2px;
                        display:block;
                        width: 50%;
                        background-color: ${Color(fgCol).alpha(0.3)};
                        background: linear-gradient(to right, ${Color(fgCol).alpha(0.3)} 10%, ${Color(fgCol).alpha(0.3).darken(0.5)} 18%, ${Color(fgCol).alpha(0.3)} 33%);
                        background-size: 600px 104px;
                        animation-name: shimmerh2;
                    }
                    .tile.loading p {
                        border-radius: 2px;
                        display: block;
                        background-color: ${Color(fgCol).alpha(0.2)};
                        background: linear-gradient(to right, ${Color(fgCol).alpha(0.2)} 10%, ${Color(fgCol).alpha(0.2).darken(0.5)} 18%, ${Color(fgCol).alpha(0.2)} 33%);
                        background-size: 1200px 104px;
                        animation-name: shimmerp;
                    }

                    .tile.loading section.tags a {
                        width: 100px;
                        border-radius: 2px;
                        display: inline-block;
                        background-color: ${Color(fgCol).alpha(0.1)};
                        background: linear-gradient(to right, ${Color(fgCol).alpha(0.1)} 10%, ${Color(fgCol).alpha(0.1).darken(0.5)} 18%, ${Color(fgCol).alpha(0.1)} 33%);
                        background-size: 1200px 104px;
                        animation-name: shimmerp;             
                    }
              

                    @keyframes shimmerh2 {
                        0%{
                            background-position: -300px 0
                        }
                        100%{
                            background-position: 300px 0
                        }
                    }

                    @keyframes shimmerimage {
                        0%{
                            background-position: -600px 0
                        }
                        100%{
                            background-position: 600px 0
                        }
                    }                    

                    @keyframes shimmerp {
                        0%{
                            background-position: -600px 0
                        }
                        100%{
                            background-position: 600px 0
                        }
                    }               
                    
                    .shimmer {
                        animation-duration: 1.25s;
                        animation-fill-mode: forwards;
                        animation-iteration-count: infinite;
                        animation-name: shimmer;
                        animation-timing-function: linear;
                        background: darkgray;
                        background: linear-gradient(to right, #eeeeee 10%, #dddddd 18%, #eeeeee 33%);
                        background-size: 1200px 104px;
                        position: relative;
                    }                
                `}</style>
            </div>            
        )
    }

    return (
        <ConfigConsumer>
        { config => (        
            content(config)
        )}
        </ConfigConsumer>        
    )
}