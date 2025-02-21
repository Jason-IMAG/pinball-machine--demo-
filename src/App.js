import Matter, { World } from 'matter-js';
import { useEffect, useRef } from 'react';


function App() {

 const sceneRef = useRef(null);
useEffect( ()=>{

  const Engine = Matter.Engine;
  const Render = Matter.Render;
  const Runner = Matter.Runner;
  const Bodies = Matter.Bodies;
  const Body = Matter.Body;
  const Composite = Matter.Composite;
  const Composites = Matter.Composites;
  const Events = Matter.Events;
  const Mouse = Matter.Mouse;
  const MouseConstraint = Matter.MouseConstraint;
  const Constraint = Matter.Constraint;

  const engine = Engine.create();

  const render = Render.create({
    element: sceneRef.current,
    engine: engine,
    options:{
      width:800, //畫布寬度
      height:600, //畫布高度
      wireframes:false, //是否顯示線框 不是單指畫布外框 而是畫布內所有物體都會變
      background: '#f0f0f0' //背景顏色
    }
  });

  //矩形參數 中心x,y 寬, 高
  const boxA = Bodies.rectangle(400, 200, 40, 40,{
    restitution: 0.8,
    render: { fillStyle: '#e74c3c' }
  });
  const boxB = Bodies.rectangle(500, 200, 40, 40,{
    restitution: 0.8,
    render: { fillStyle: '#ffe4c8' }
  });

  //圓形參數 圓心x,y 半徑
  const circle = Bodies.circle(400, 200, 25, {
    restitution: 0.8,
    frictionAir: 0.01,
    render: { fillStyle: '#fffef4' }
  });

  const rockOptions = { density: 0.004 };
  const rock = Bodies.polygon(700, 480, 8, 20, rockOptions);
  const anchor = { x: 700, y: 480 };
  const elastic = Constraint.create({ 
    pointA: anchor, 
    bodyB: rock, 
    length: 0.01,
    damping: 0.01,
    stiffness: 0.05
});

 //多個障礙物
 const obstacles = [
  Bodies.circle(400, 250, 10,{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  }),
  Bodies.circle(500, 150, 10,{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  }),
  Bodies.circle(670, 450, 10,{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  }),
  Bodies.circle(450, 400, 10,{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  }),
  Bodies.circle(730, 450, 10,{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  }),

 ]

  //地板
  const ground = Bodies.rectangle(400, 500, 400, 20, {isStatic: true});
  
  //牆壁
  const walls = [
    // 底部
    Bodies.rectangle(400, 590, 800, 20, { 
        isStatic: true,
        render: { 
            fillStyle: '#2c3e50',
            opacity: 0.5 
        }
    }),
    // 頂部
    Bodies.rectangle(400, 10, 800, 20, { 
        isStatic: true,
        render: { 
            fillStyle: '#2c3e50',
            opacity: 0.5 
        }
    }),
    // 左邊
    Bodies.rectangle(10, 300, 20, 600, { 
        isStatic: true,
        render: { 
            fillStyle: '#2c3e50',
            opacity: 0.5 
        }
    }),
    // 右邊
    Bodies.rectangle(790, 300, 20, 600, { 
        isStatic: true,
        render: { 
            fillStyle: '#2c3e50',
            opacity: 0.5 
        }
    })
];

const moveBall = Bodies.circle(200, 300, 10,{
  isStatic:true, 
  render:{ fillStyle:'#000000'}
});
const moveBall2 = Bodies.circle(450, 450, 10,{
  isStatic: true,
  render:{ fillStyle:'#030402'}
});

//加入滑鼠控制
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
      stiffness: 0.2,
      render: {
          visible: false
      }
  }
});

//啟動事件
Events.on(engine, 'beforeUpdate', () => {
  //計算讓球上下移動的y軸
  const py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002);
  const px = 450 + 100 * Math.sin(engine.timing.timestamp * 0.002);
  //讓球動起來
  Body.setPosition(moveBall, { x:200, y:py}, true)
  Body.setPosition(moveBall2, { x:px, y:450}, true)

});
Events.on(engine, 'afterUpdate', () => {
  // 檢查球是否掉出畫面
  if (circle.position.y > 530) {
    circle.render.visible = false;
    setTimeout(() => {
      circle.render.visible = true;
      // 重置球的位置
      Body.setPosition(circle, {
        x: 400,
        y: 100
      });
      //重置球的速度 不然會因為重力的關係一直加速
      Body.setVelocity(circle, {x:0, y:0});
    }, 500)
      
  }
});



  //加入所有物體到世界
  Composite.add(engine.world, [...walls, circle, ground, ...obstacles, moveBall, moveBall2, elastic, rock ]);
  //加入滑鼠控制到世界
  Composite.add(engine.world, mouseConstraint);
  //啟動渲染
  Render.run(render);
  render.mouse = mouse;
  //啟動Runner
  const runner = Runner.create();

  Runner.run(runner, engine);


  //碰撞偵測

  //清理函數 避免渲染出兩個畫面
  return () => {
    //停止渲染
    Render.stop(render);
    render.canvas.remove();
    
    //清除世界
    World.clear(engine.world);
    //清除引擎
    Engine.clear(engine);
  }
},[])
  


  return (
    <div
      ref={sceneRef}
      style={{
        width:'800px',
        height:'600px',
        margin:'auto',
        marginTop:'10px'
      }} 
    />
  );
}

export default App;
