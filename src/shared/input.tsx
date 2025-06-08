import { TextInput, TextInputProps, StyleSheet, Pressable, View } from "react-native";
import { Colors } from "./tokens";
import { useState } from "react";
import EyeOpenIcon from "../../assets/icons/eye-open";
import EyeClosedIcon from "../../assets/icons/eye-closed";

export function Input({isPassword, ...props}:TextInputProps & {isPassword?:boolean}){
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    return (
        <View>
            <TextInput
                style = {styles.input}
                secureTextEntry={isPassword && !isPasswordVisible}
                placeholderTextColor={Colors.colorTextWhite}
                {...props} />
            {isPassword && <Pressable onPress={()=> setIsPasswordVisible(state => !state)} style={styles.eyeIcon}>
                {isPasswordVisible? <EyeOpenIcon/>: <EyeClosedIcon/>}
            </Pressable>}
        </View>
    )
}

const styles = StyleSheet.create({
    input:{
        backgroundColor:Colors.white,
        fontSize:14,
        height:38,
        paddingHorizontal:8,
        borderRadius:8,
    },
    eyeIcon:{
        position: 'absolute',
        right:0,
        paddingHorizontal:16,
        paddingVertical:6
    }
})