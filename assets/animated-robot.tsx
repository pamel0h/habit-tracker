import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';

// Создаем анимированные компоненты
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path); // Для хвоста

const AnimatedRobot = () => {
  // Анимация для глаз (изменение ширины)
  const eyeScale = useSharedValue(1);

  // Анимация для покачивания всей фигуры (смещение по Y)
  const swayOffset = useSharedValue(0);

  // Анимация для покачивания хвоста
  const swayTail = useSharedValue(0);

  useEffect(() => {
    // Моргание глаз: повторяем анимацию с паузой в 3 секунды
    eyeScale.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 100, easing: Easing.ease }),
        withTiming(1, { duration: 100, easing: Easing.ease }),
        withDelay(2800, withTiming(1, { duration: 0 }))
      ),
      -1, // бесконечное повторение
      false
    );

    // Покачивание всей фигуры: вверх и вниз
    swayOffset.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.ease) }), // Вверх
        withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.ease) })   // Вниз
      ),
      -1, // бесконечное повторение
      true // реверс для плавного цикла
    );

    // Покачивание хвоста: более выраженное движение
    swayTail.value = withRepeat(
      withSequence(
        
        withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.ease) }), // Вверх
        withTiming(7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),// Вниз
      ),
      -1, // бесконечное повторение
      true // реверс для плавного цикла
    );
  }, []);

  // Анимированные свойства для глаз
  const leftEyeProps = useAnimatedProps(() => ({
    rx: 16.5 * eyeScale.value,
    ry: 11,
  }));

  const rightEyeProps = useAnimatedProps(() => ({
    rx: 16.5 * eyeScale.value,
    ry: 11,
  }));

  // Анимированный стиль для всей фигуры (покачивание)
  const animatedSvgStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: swayOffset.value }],
  }));

  // Анимированные свойства для хвоста
  const tailProps = useAnimatedProps(() => ({
    transform: [{ translateY: swayTail.value }],
  }));

  return (
    <AnimatedSvg
      width={150}
      height={163}
      fill="none"
      style={[styles.bot, animatedSvgStyle]} // Анимация тела
    >
      {/* Тело робота */}
      <Path
        fill="#EBE0E0"
        stroke="#474040"
        d="M.5 120.011c0 22.811 23.828 41.5 53.5 41.5 29.671 0 53.5-18.689 53.5-41.5 0-22.81-23.829-41.5-53.5-41.5-29.672 0-53.5 18.69-53.5 41.5Z"
      />
      <Ellipse
        cx={44}
        cy={30}
        fill="#B3C3CF"
        rx={44}
        ry={30}
        transform="matrix(-1 0 0 1 98 91.011)"
      />

      {/* Хвост (анимированный) */}
      <AnimatedPath
        fill="#8DB8DA"
        d="m53.739 75.58 18.02-65.872L72.9 54.75l75.028-4.488-94.19 25.317Z"
        animatedProps={tailProps} // Используем animatedProps вместо style
      />

      {/* Левый глаз (анимированный) */}
      <AnimatedEllipse
        cx={16.5}
        cy={11}
        fill="#2C2929"
        animatedProps={leftEyeProps}
        transform="matrix(0 -1 -1 0 38 139.011)"
      />

      {/* Правый глаз (анимированный) */}
      <AnimatedEllipse
        cx={16.5}
        cy={11}
        fill="#2C2929"
        animatedProps={rightEyeProps}
        transform="matrix(0 -1 -1 0 93 139.011)"
      />

      {/* Блики (не анимированные) */}
      <Ellipse cx={22.5} cy={115.011} fill="#D9D9D9" rx={3.5} ry={2} />
      <Ellipse cx={78.5} cy={115.011} fill="#D9D9D9" rx={3.5} ry={2} />
    </AnimatedSvg>
  );
};

const styles = StyleSheet.create({
  bot: {
    marginLeft: 48,
    width: 150,
    height: 162,
  },
});

export default AnimatedRobot;