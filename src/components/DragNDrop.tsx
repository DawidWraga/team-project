import { Box, BoxProps } from '@chakra-ui/react';
import { Droppable } from 'react-beautiful-dnd';
import { Draggable } from 'react-beautiful-dnd';

interface IDroppableProps {
  id: string;
  droppableProps?: Record<any, any>;
  dropContainerProps?: BoxProps | ((provided: any) => Record<any, any>);
  children: React.ReactNode;
}
export const DroppableWrapper = (props: IDroppableProps) => {
  const { id, droppableProps, dropContainerProps, children } = props;
  return (
    <Droppable droppableId={id} {...droppableProps}>
      {(provided) => {
        const dropContainerPropsObject =
          typeof dropContainerProps === 'object'
            ? dropContainerProps
            : dropContainerProps(provided);

        return (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            {...dropContainerPropsObject}
          >
            {children}
            {provided.placeholder}
          </Box>
        );
      }}
    </Droppable>
  );
};

interface IDraggableProps {
  id: string;
  index: number;
  draggableProps?: Record<any, any>;
  dragContainerProps?: BoxProps | ((provided: any) => BoxProps);
  whileDraggingProps?: BoxProps;
  children: React.ReactNode;
}

export const DraggableWrapper = (props: IDraggableProps) => {
  const { id, index, draggableProps, dragContainerProps, children } = props;

  return (
    <Draggable draggableId={id} index={index} {...draggableProps}>
      {(provided, snapshot) => {
        const dragContainerPropsObject =
          typeof dragContainerProps === 'object'
            ? dragContainerProps
            : dragContainerProps(snapshot);

        return (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            //provided.dragHandleProps = logic for "grabbable" part of the element. Default = entire element is draggable. To make draggable part of element more targeted, move ...provided.dragHandleProps to other element

            style={provided.draggableProps.style}
            {...dragContainerPropsObject}
          >
            {children}
          </Box>
        );
      }}
    </Draggable>
  );
};
