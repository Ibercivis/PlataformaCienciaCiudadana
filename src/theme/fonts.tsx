import { Dimensions } from "react-native";

const window = Dimensions.get('window');

export const FontSize = {
    fontSize : window.width > 500 ? 50 : 30,
    fontSizeText : window.width > 500 ? 27 : 12,
}