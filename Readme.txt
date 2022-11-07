Modulos instalados y mini guía:

    - @react-navigation/native
    - react-native-screens react-native-safe-area-context
        -- Requerimientos Android:
            añadir el codigo en el body de android/app/src/main/java/'package name'/MainActivity.java

            import android.os.Bundle;

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(null);
            }
        -- Requerimentos IOS;
            npx pod-install ios

    - @react-navigation/stack
    - react-native-gesture-handler
        -- Requerimientos:
            Añadir la siguiente linea en el top del fichero index.js o App.tsx
                import 'react-native-gesture-handler';

    - @react-native-masked-view/masked-view
    - @react-navigation/drawer
    - react-native-gesture-handler react-native-reanimated
        -- Requerimientos:
            En el babel.config.js añadir:
             plugins:[
                'react-native-reanimated/plugin',
             ],
            
            IMPORTANTE npm start -- --reset-cache 
    
    - --save react-native-permissions
     -- Instrucciones IOS/android:
        https://www.npmjs.com/package/react-native-permissions

    - --save react-native-vector-icons
        -- Requerimientos Android:
            En android/app/src/build.grandle pegar:

            project.ext.vectoricons = [
                iconFontNames: [ 'Ionicons.ttf' ] // nombre de las fuentes
            ]

            apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

        -- Requerimientos IOS:
            https://github.com/oblador/react-native-vector-icons
            Se requiere xCode

    - react-native-maps
        -- Guía API-KEY e instalaciones https://github.com/react-native-maps/react-native-maps
        -- Requerimientos Android:
            <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="(codigo de proporcionado por google)"/>
    - @react-native-community/geolocation --save
        -- Requerimentos Android:
         Añadir en el manifest la siguiente linea con el permisio <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        -- Requerimentos IOS:
            Necesitas incluir NSLocationWhenInUseUsageDescription y NSLocationAlwaysAndWhenInUseUsageDescription en Info.plist para habilitar la
            geolocalización cuando corres la app. Si la app soporta iOS 10 y versiones anteriores, la NSLocationAlwaysUsageDescription key es requerida.

    - Si se desea añadir un carousel: https://github.com/meliorence/react-native-snap-carousel
    - Si se desean añadir tabs/drawer https://reactnavigation.org/docs/bottom-tab-navigator/#props
