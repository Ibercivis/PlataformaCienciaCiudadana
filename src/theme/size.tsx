import { Dimensions } from "react-native";

const window = Dimensions.get('window');

export const Size = {
    globalWidth : window.width,
    globalHeight : window.height,
    navigationButtonWith: window.width > 500 ? 200 : window.width < 500 && window.width > 450 ? 130 : 110,
    navigationButtonHeigh: window.width > 720 ? 50 : window.width < 500 && window.width > 450 ? 40 : 40,
}