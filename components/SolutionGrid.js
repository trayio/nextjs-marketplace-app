import classNames from "classnames"
import Color from "color"
import { map, filter, get, times } from 'lodash'

import SolutionTile from './SolutionTile';
import { useSolutionConnector } from '../utils/hooks';
import { ConfigConsumer } from '../utils/config'

export default function SolutionGrid({ loading, user, jwt, solutions, instances, Component = SolutionTile, connect, update, disconnect, enable, disable, tagFilters }) {

    const onConnect = async function() {
        try {
          await connect.apply(this, arguments);
        } catch (e) {
          console.error(e);
        }
      }
    
      const onUpdate = async function() {
        try {
          await update.apply(this, arguments);
        } catch (e) {
          console.error(e);
        }
      }  
    
      const onDisconnect = async function() {
        try {
          await disconnect.apply(this, arguments);
        } catch (e) {
          console.error(e);
        }
      }  
      
      const onEnable = async function() {
        try {
          await enable.apply(this, arguments);
        } catch (e) {
          console.error(e);
        }
      }
      
      const onDisable = async function() {
        try {
          await disable.apply(this, arguments);
        } catch (e) {
          console.error(e);
        }
      }     

    return (
        <ConfigConsumer>
        { config => (        
            <div className={classNames('solutions')}>
              
                {
                loading ? (
                    times(config.get('layout.grid.loadingCols'), i => (
                        <Component
                            key={i}
                            loading={true}
                        />
                    ))
                ) : (
                    solutions ? (
                        map(solutions, s => (
                            <Component
                                key={s.id}
                                solution={s}
                                instances={s.instances}
                                onConnect={async () => await onConnect(s, config)}
                                onDisconnect={async () => await onDisconnect(get(s, 'instances.0'))}
                                onEnable={async () => await onEnable(get(s, 'instances.0'))}
                                onDisable={async () => await onDisable(get(s, 'instances.0'))}                                
                                tagFilters={tagFilters}
                            />
                        ))
                    ) : (
                        map(instances, i => (
                            <Component
                                key={i.id}
                                isInstance={true}
                                solution={i.solution}
                                instances={[i]}
                                onConnect={async () => await onUpdate(i, config)}
                                onDisconnect={async () => await onDisconnect(i)}
                                onEnable={async () => await onEnable(i)}
                                onDisable={async () => await onDisable(i)}
                                tagFilters={tagFilters}
                            />
                        ))                        
                    )
                )           
                }              

                <style jsx>{`              
                    .solutions {
                        display: grid;
                        grid-template-columns: ${config.fn.getGridColumns()};
                        grid-gap: ${config.get('layout.grid.gap')};
                        box-sizing: border-box;
                    }                   
                `}</style>
            </div>
        )}
        </ConfigConsumer>        
    )
}