import React, {PropsWithChildren, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Paragraph, Title} from 'react-native-paper';
import {Size} from '../theme/size';
import {IconTemp} from './IconTemp';

type AccordionItemPros = PropsWithChildren<{
  title: string;
}>;

export const CollapseItem = ({children, title}: AccordionItemPros) => {
  const [expanded, setExpanded] = useState(false);

  const toggleItem = () => {
    setExpanded(!expanded);
  };

  const body = <Paragraph style={{marginVertical: '1%'}}>{children}</Paragraph>;

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Title>Descripcion</Title>
        <TouchableOpacity
          onPress={() => {
            toggleItem();
          }}>
          <IconTemp
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={Size.iconSizeMedium}
          />
        </TouchableOpacity>
      </View>
      {expanded && body}
    </>
  );
};
