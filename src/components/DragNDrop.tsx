import { Box, BoxProps } from '@chakra-ui/react';
import {
  DraggableProps,
  DraggableProvidedDragHandleProps,
  Droppable,
} from 'react-beautiful-dnd';
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
  children:
    | React.ReactNode
    | ((provided: { dragHandleProps: DraggableProvidedDragHandleProps }) => JSX.Element);
}

export const DraggableWrapper = (props: IDraggableProps) => {
  const { id, index, draggableProps, dragContainerProps, children } = props;

  return (
    <Draggable draggableId={id} index={index} {...draggableProps}>
      {(provided, snapshot) => {
        const { draggableProps, innerRef, dragHandleProps } = provided;

        const dragContainerPropsObject =
          typeof dragContainerProps === 'object'
            ? dragContainerProps
            : dragContainerProps(snapshot);

        const childIsFunction = typeof children === 'function';

        // const ChildComponent = childIsFunction && ;

        return (
          <Box
            ref={innerRef}
            {...draggableProps}
            // if child is not function, make entire element draggable
            {...(!childIsFunction && dragHandleProps)}
            style={provided.draggableProps.style}
            {...dragContainerPropsObject}
          >
            {/* if child is function, call function and pass draggableProps */}
            {childIsFunction ? children({ dragHandleProps }) : children}
          </Box>
        );
      }}
    </Draggable>
  );
};
