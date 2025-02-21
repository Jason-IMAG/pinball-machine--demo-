import Matter, { Vertices, World } from 'matter-js';
import { useEffect, useRef } from 'react';


function App() {

  const sceneRef = useRef(null);
  useEffect( ()=>{

    const { 
      Engine, 
      Render, 
      Runner, 
      Bodies, 
      Body, 
      Composite, 
      Composites,
      Events,
      Mouse,
      MouseConstraint,
      Constraint,
      
    } = Matter;

    

    const engine = Engine.create();

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options:{
        width:800, //畫布寬度
        height:1200, //畫布高度
        wireframes:false, //是否顯示線框 不是單指畫布外框 而是畫布內所有物體都會變
        background: '#f0f0f0' //背景顏色
      }
    });

    //矩形參數 中心x,y 寬, 高
    const boxA = Bodies.rectangle(665, 320, 20, 200,{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#e74c3c' }
    });
    const boxB = Bodies.rectangle(735, 320, 20, 200,{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#ffe4c8' }
    });

    //圓形參數 圓心x,y 半徑
    const circle = Bodies.circle(400, 200, 25, {
      restitution: 0.3,
      friction: 0.05,
      frictionAir: 0.001,
      density: 0.001,
      render: { fillStyle: '#fffef4' }
    });
  //發射器彈簧及物體
  
    const rockOptions = { density: 0.004 };
    const rock = Bodies.circle(700, 480, 20, rockOptions);
    const anchor = { x: 700, y: 480 };
    const spring = Constraint.create({ 
      pointA: anchor, 
      bodyB: rock, 
      length: 0.1,
      damping: 0.1,
      stiffness: 0
  });

  //多個隨機障礙物
  function createObstacles(x, y, moveX, radius, count){
    const ManyObstacles = [ 
        Bodies.circle(670, 450, 10,{
          isStatic: true,
          restitution: 0.8,
          render:{ fillStyle:'#030402'}
        }),
        Bodies.circle(730, 450, 10,{
              isStatic: true,
              restitution: 0.8,
              render:{ fillStyle:'#030402'}
            })
        ];
    for(let i = 0; i <= count; i ++){
      const loopX = x * i  + moveX + 100;
      const loopY = y + 100;
      const obstacle = Bodies.circle( loopX, loopY, radius, {
        isStatic: true,
        restitution: 0.8,
        render:{ fillStyle:'#030402'}
      })
      ManyObstacles.push(obstacle);
    } 
    return ManyObstacles;
  }
  //參數 障礙物間距, 障礙物Y , 平移X的量, 障礙物半徑, 障礙物數量
  const obstacles1 = createObstacles(80, 80, 80, 10, 4);
  const obstacles2 = createObstacles(80, 180, 40, 10, 6);
  const obstacles3 = createObstacles(80, 280, 0, 10, 6);
  const obstacles4 = createObstacles(80, 380, 40, 10, 6);
  const obstacles5 = createObstacles(80, 480, 0, 10, 6);
  const obstacles6 = createObstacles(80, 580, 40, 10, 6);
  const obstacles = [...obstacles1, ...obstacles2, ...obstacles3, ...obstacles4, ...obstacles5, ...obstacles6];

    //地板
    const ground = Bodies.rectangle(400, 800, 400, 20, {isStatic: true});
    
    //牆壁
    const walls = [
      // 底部
      Bodies.rectangle(400, 920, 800, 20, { 
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
      Bodies.rectangle(10, 310, 20, 1200, { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      }),
      // 右邊
      Bodies.rectangle(790, 310, 20, 1200, { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      })
  ];
    //彎道
    function createArcPath(centerX, centerY, radius, startAngle, endAngle, segments = 30) {
      const bodies = [];
      const angleStep = (endAngle - startAngle) / (segments - 1);
      
      for (let i = 0; i < segments; i++) {
          const angle = startAngle + (angleStep * i);
          
          // 計算每個段落的位置
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          const segment = Bodies.rectangle(
              x,
              y,
              20,  // 段落寬度
              15,  // 段落高度
              {
                  isStatic: true,
                  restitution: 0,     // 設置為 0 表示無彈跳
                  friction: 0.05,     // 可以調整摩擦力
                  slop:0.5,      
                  angle: angle,  // 使段落切於圓弧
                  render: { 
                      fillStyle: '#3498db',
                      strokeStyle: '#2980b9',
                      lineWidth: 1
                  },
                  chamfer: { radius: 20 }
              }
          );
          
          bodies.push(segment);
      }

      return bodies;
  }
  const arcPath1 = createArcPath(
    555,    // 圓心 x
    210,    // 圓心 y
    180,    // 半徑
    -Math.PI/2,      // 起始角度（弧度）
    0,  // 結束角度（弧度）
    100      // 段落數
  );
  const arcPath2 = createArcPath(
    220,    // 圓心 x
    210,    // 圓心 y
    180,    // 半徑
    Math.PI,      // 起始角度（弧度）
    Math.PI*1.5,  // 結束角度（弧度）
    100     // 段落數
  );

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
    const px = 350 + 150 * Math.sin(engine.timing.timestamp * 0.002);
    //讓障礙物動起來
    Body.setPosition(moveBall, { x:px, y:230}, true)
    Body.setPosition(moveBall2, { x:px, y:430}, true)

  });
  Events.on(engine, 'afterUpdate', () => {
    // 檢查球是否掉出畫面
    if (circle.position.y > 810) {
      circle.render.visible = false;
      setTimeout(() => {
        circle.render.visible = true;
        // 重置球的位置
        Body.setPosition(circle, {
          x: 700,
          y: 300
        });
        //重置球的速度 不然會因為重力的關係一直加速
        Body.setVelocity(circle, {x:0, y:0});
      }, 500)
        
    }
  });



    //加入所有物體到世界
    Composite.add(engine.world, [...walls, circle, ground, ...obstacles, moveBall, moveBall2, spring, rock, boxA, boxB, ...arcPath1, ...arcPath2 ]);
    //加入滑鼠控制到世界
    Composite.add(engine.world, mouseConstraint);
    //啟動渲染
    Render.run(render);
    render.mouse = mouse;
    //啟動Runner
    const runner = Runner.create();

    Runner.run(runner, engine);
   
    // 添加鍵盤事件監聽
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {  // 空白鍵
          spring.stiffness = 0.1;  // 按下時啟動彈力
          event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
          spring.stiffness = 0;  // 放開時關閉彈力
          event.preventDefault();
      }
    };

     // 添加事件監聽器
     window.addEventListener('keydown', handleKeyDown);
     window.addEventListener('keyup', handleKeyUp);

    //碰撞偵測

    //清理函數 避免渲染出兩個畫面
    return () => {

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
       
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
        height:'1200px',
        margin:'auto',
        marginTop:'10px'
      }} 
    />
  );
}

export default App;
