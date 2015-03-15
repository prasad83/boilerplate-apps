[Apache ant](http://en.wikipedia.org/wiki/Apache_Ant) build file boilerplate that will be handy to manage java project builds.

_Replace APPNAME, main.class, LIBS placeholder according to suit your needs._

```
<?xml version="1.0"?>

<project name="APPNAME" default="dist" basedir=".">

	<property name="app.name" value="APPNAME"/>
	
	<property name="src.home" value="src" />	
	<property name="build.home" value="bin" />	
	<property name="dist.home" value="dist" />
	
	<property name="main.class" value="your.app.package.MainClass"/>
	
	<property name="compile.debug"       value="true"/>
	<property name="compile.deprecation" value="false"/>
	<property name="compile.optimize"    value="true"/>

	<!-- Set of library to be included during compilation or execution -->
	<path id="compile.classpath">
		<fileset dir="LIBS">
			<include name="*.jar"/>
		</fileset>
	</path>
	
	<target name="all" depends="clean,compile,dist"></target>
		
	<target name="clean">
		<delete dir="${build.home}"/>
		<delete dir="${dist.home}"/>
	</target>
		
	<target name="prepare">
		<mkdir dir="${build.home}"/>
		<mkdir dir="${dist.home}"/>
	</target>
		
	<target name="compile" depends="prepare">
		<javac srcdir="${src.home}" 
			destdir="${build.home}"
			debug="${compile.debug}"
			deprecation="${compile.deprecation}"
			optimize="${compile.optimize}">			
			<classpath refid="compile.classpath"></classpath>
		</javac>
	</target>
	
	<target name="dist" depends="compile">
		
		<jar jarfile="${dist.home}/${app.name}.jar" basedir="${build.home}">
			<manifest>
				<attribute name="Main-Class" value="${main.class}"/>
			</manifest>
		</jar>
	</target>
	
	<target name="run" depends="dist">
        <java fork="true" classname="${main.class}">
            <classpath>
                <path refid="compile.classpath"/>
                <path location="${dist.home}/${app.name}.jar"/>
            </classpath>
        </java>
    </target>
</project>

```