import React from 'react'
import Dice1 from "react-native-bootstrap-icons/icons/dice-1";
import Eye from "react-native-bootstrap-icons/icons/eye";
import EyeSlash from "react-native-bootstrap-icons/icons/eye-slash";
import Circle from "react-native-bootstrap-icons/icons/circle";
import CircleFill from "react-native-bootstrap-icons/icons/circle-fill";
import { Colors } from '../../theme/colors';

interface Props {
    name: string;
    size: number;
    color?: string;
  }

export const IconBootstrap = ({name, size, color = Colors.primaryDark}: Props) => {

switch(name){
    case 'eye':
        return(
            <Eye width={size} height={size} fill={color} />
        );
    case 'eye-slash':
        return(
            <EyeSlash width={size} height={size} fill={color} />
        );
    case 'circle':
        return(
            <Circle width={size} height={size} fill={color} />
        );
    case 'circle-fill':
        return(
            <CircleFill width={size} height={size} fill={color} />
        );

    default:
        return(<Dice1 width={size} height={size} fill={color} />)
}

}
