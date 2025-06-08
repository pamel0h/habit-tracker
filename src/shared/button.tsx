import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";
import { Colors } from "./tokens";

export function Button({ 
  text, 
  onPress,
  disabled = false,
  ...props 
}: PressableProps & { 
  text: string;
  disabled?: boolean;
}) {
  return (
    <Pressable 
      onPress={onPress} 
      disabled={disabled}
      {...props}
    >
      {({ pressed }) => (
        <View style={[
          styles.button,
          pressed && styles.buttonPressed,
          disabled && styles.disabled
        ]}>
          <Text style={[
            styles.text,
            pressed && styles.textPressed,
            disabled && styles.textDisabled
          ]}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white,
    borderRadius: 8,
    borderWidth: 2,
    height: 45,
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    backgroundColor: Colors.white,
  },
  disabled: {
    opacity: 0.6,
    borderColor: Colors.gray,
  },
  text: {
    color: Colors.white,
  },
  textPressed: {
    color: Colors.black,
  },
  textDisabled: {
    color: Colors.gray,
  },
});