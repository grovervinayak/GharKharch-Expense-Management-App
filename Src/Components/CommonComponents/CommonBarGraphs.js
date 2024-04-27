import React, { Component, useEffect } from 'react';
import {Text, View, StyleSheet, Button, Alert,TextInput, ScrollView, Image, TouchableOpacity, TouchableHighlight} from 'react-native';

import { scale, moderateScale, verticalScale} from '../Scaling';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer, VictoryAxis } from "victory-native";
import Svg from 'react-native-svg';

export function ExpenseBarGraph(props) {
    return (
        <Svg style={{height:340}}>
            <VictoryChart width={scale(315)} height={300} theme={VictoryTheme.material} domainPadding={{x: 25, y: 15}} style={{marginLeft:120}} 
                          standalone={false}>
                <VictoryAxis
                    style={{
                        tickLabels: {fontSize: 10}
                    }}
                    orientation="left"
                    dependentAxis
                />
                <VictoryAxis
                    style={{
                        tickLabels: {fontSize: 10, padding: 30, angle:-45}
                    }}
                    orientation="bottom"
                />

                <VictoryBar data={props.data} 
                            x={props.x_axis}
                            y={props.y_axis} 
                            style={{data:{fill:'#e89110'}}}
                            animate={{duration: 2000, onLoad: {duration: 1000}, onEnter: {duration: 500, before: () => ({y: 0})}}}

                            events={[
                            {
                                target: "data",
                                eventHandlers: {
                                    onPress: (evt, context) => { 
                                        console.log(evt, context);
                                        return [
                                        {
                                            target: "labels",
                                            mutation: (props) => {
                                            return ({ active: true })}
                                        }
                                        ]; 
                                    }
                                }
                            }
                    ]}/>
                      
            </VictoryChart>
        </Svg>
    )
}